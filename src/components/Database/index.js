import React, { useState, useEffect } from "react";
import firebase from "./lib/firebase";

// timestamps
import dayjs from "dayjs";
import "dayjs/locale/ja";
dayjs.locale("ja");

export default firebase;

export const pushRecordToDatabase = props => {
  const daystamp = dayjs().format("YYYY-MM-DD");
  const collection = (props && props.collection) || "userTimeBin";
  const user = (props && props.user) || "test-user@gmail.com";
  const data = (props && props.data) || {
    date: "value",
    location: { lat: 0, lng: 0 },
    time: "now"
  };

  if (props && props.data) {
    // firebase hack to make the document
    // "show up" on querysnapshots
    firebase
      .firestore()
      .collection(collection)
      .doc(user)
      .set({});

    firebase
      .firestore()
      .collection(collection)
      .doc(user)
      .collection(daystamp)
      .add(data)
      .then(v => {
        console.log("data pushed!", v);
      })
      .catch(e => {
        console.log("error: ", e);
      });
  }
};

export const FireStoreDEBUG = ({
  collection = "userTimeBin",
  doc = "userRecords",
  user,
  onUpdate
}) => {
  const [dbState, setDBState] = useState({});

  useEffect(() => {
    if (!user) return;

    // get list to loop
    // TODO: optional - trigger on db update
    const getAllUsers = async () => {
      let users = await firebase
        .firestore()
        .collection("userTimeBin")
        .get()
        .then(snapshot => {
          return snapshot.docs.map(doc => doc.id);
        })
        .catch(e => {
          setDBState({ error: e.toString() });
          return [];
        });

      users = Array.from(users);

      users && setDBState(users);
      return users;
    };

    // get data
    const getDataByDate = async (user, date = "2019-07-13") => {
      console.log("showing user: ", user);

      // actually the point is to loop over all users to
      // process their raw data
      const currentUser = await getAllUsers().then(
        users => users.filter(v => v === user)[0]
      );
      if (!currentUser) return [];

      return await firebase
        .firestore()
        .collection(collection)
        .doc(currentUser)
        .collection(date)
        .get()
        .then(querySnapshot => {
          return querySnapshot.docs.map(doc => {
            return doc.data();
          });
        });
    };

    // process data
    const convertRawDataToMatrix = async () => {
      const bounds = {
        topLeft: {
          lat: 35.730415,
          lng: 139.680338
        },
        bottomRight: {
          lat: 36.632705,
          lng: 139.680338
        }
      };

      const data = await getDataByDate(user);
      console.log(data);

      const mapLatLngToBounds = (lat, lng, x = 50, y = 50, bounds = bounds) => {
        // remaps lat lng from raw data to 0-50
        // if outside bounds, fill with 0
      };

      const buildOriginalDepartureMaps = () => {
        // the one that the user promises to reduce
        // [[0,0,0,0,-1,-1,-1,0,0,0], [0,-1,-1,0,0,0]]
        return [[], []];
      };

      const buildOffPeakDepartureMaps = () => {
        // the one that is currently tracking
        // [[0,0,0,0,1,1,1,0,0,0], [0,1,1,0,0,0]]
        return [[], []];
      };

      return {
        original: buildOriginalDepartureMaps(),
        offPeak: buildOffPeakDepartureMaps()
      };
    };

    convertRawDataToMatrix();

    // push back to firebase
    const pushMatrixToUser = () => {};

    // firebase
    //   .firestore()
    //   .collection(collection)
    //   .doc("koichi@gmail.com")
    //   .collection("2017-07-16")
    //   .get()
    //   .then(querySnapshot => {
    //     if (!querySnapshot.empty) {
    //       console.log("no documents found!");
    //     }
    //     let res = [];
    //     querySnapshot.forEach(doc => {
    //       console.log(doc);
    //       doc
    //         .collection()
    //         .get()
    //         .then(qSnapshot => {
    //           qSnapshot.forEach(doc => {
    //             console.log(doc);
    //           });
    //         });
    //       console.log(doc);
    //       console.log(doc.data());
    //       res.push({ id: doc.id, data: doc.data() });
    //     });

    //     setDBState(res);
    //   })
    //   .catch(e => {
    //     setDBState({ error: e });
    //   });

    return () => setDBState({});
  }, [user]);

  useEffect(() => {
    if (onUpdate) onUpdate(dbState);
  }, [dbState]);

  return (
    <p style={{ fontSize: 10 }}>db state: {JSON.stringify(dbState, null, 2)}</p>
  );
};

export const FireStoreState = ({
  collection = "userTimeBin",
  doc = "userRecords",
  user = "@gmail.com",
  onUpdate
}) => {
  const [dbState, setDBState] = useState({});

  useEffect(() => {
    firebase
      .firestore()
      .collection(collection)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.exists) {
          console.log("no documents founds!");
        }
        console.log(querySnapshot);
        let res = [];
        querySnapshot.forEach(doc => {
          res.push({ id: doc.id, data: doc.data() });
        });

        setDBState(res);
      })
      .catch(e => {
        setDBState({ error: e });
      });

    return () => setDBState({});
  }, [user]);

  useEffect(() => {
    if (onUpdate) onUpdate(dbState);
  }, [dbState]);

  return (
    <p style={{ fontSize: 10 }}>db state: {JSON.stringify(dbState, null, 2)}</p>
  );
};

// notify function
export const reportAppStatetoDB = currentState => {
  firebase
    .firestore()
    .collection("appState")
    .doc("currentState")
    .set(currentState, { merge: true })
    .then(v => console.log("REMOTE STATE UPDATER: complete. ", v))
    .catch(e => console.log("REMOTE DB STATE UPDATE ERROR: ", e));
};

const sortTimestampArray = (data, latest = false) => {
  if (latest) return data.sort((prev, next) => dayjs(next) - dayjs(prev));
  // latest first
  else return data.sort((prev, next) => dayjs(prev) - dayjs(next)); // earliest first
};

export const logging = (message, callback) => {
  const timestamp = dayjs().format("YYYY-MM-DDTHH:mm:ss:SSS");
  const daystamp = dayjs().format("YYYY-MM-DD");

  firebase
    .firestore()
    .collection("logs")
    .doc(daystamp)
    .collection("logs")
    .doc(timestamp)
    .set({ message: message }, { merge: true })
    .then(v => {
      callback && callback(v);
    })
    .catch(e => console.log("LOGGING ERROR: ", e));
};

export const activityMonitor = async callback => {
  function convertToObject(input, showFunction) {
    // recursively
    // https://stackoverflow.com/questions/37733272/convert-dom-object-to-javascript-object
    let obj = {};
    for (var p in input) {
      switch (typeof input[p]) {
        case "function":
          if (showFunction) obj[p] = `function: ${input[p]}`;
          break;
        case "object":
          obj[p] = convertToObject(input[p], showFunction);
          break;
        case "number":
          obj[p] = input[p];
          break;
        default:
          obj[p] = input[p];
      }
    }
    return obj;
  }

  const timestamp = dayjs().format("YYYY-MM-DDTHH:mm:ss:SSS");
  const daystamp = dayjs().format("YYYY-MM-DD");

  // browser tab storage
  let browserStorage;
  if ("storage" in navigator && "estimate" in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    browserStorage = {
      usage: estimate.usage,
      quota: estimate.quota,
      percent: `${((estimate.usage * 100) / estimate.quota).toFixed(0)} used`
    };
  } else {
    browserStorage = "browser does not have storage API";
  }
  // js heap size
  //   This API returns three pieces of data:
  // jsHeapSizeLimit - The amount of memory (in bytes) that the JavaScript heap is limited to.
  // totalJSHeapSize - The amount of memory (in bytes) that the JavaScript heap has allocated including free space.
  // usedJSHeapSize - The amount of memory (in bytes) currently being used.
  const mem = window.performance.memory || {};
  // RAM
  const ram =
    `${navigator.deviceMemory} GB` ||
    "browser does not have deviceMemory API (ram)";
  // network speed
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    navigator.msConnection;
  const connectionSpeed = connection
    ? connection.effectiveType
    : "browser does not have connection API";
  // battery
  let battery;
  if ("getBattery" in navigator) {
    battery = await navigator.getBattery();
  }
  const batteryLevel = battery
    ? battery.level
    : "browser does not have battery API";
  // general performance
  // .toJSON() is unreliable, returns custom objects
  const performance = convertToObject(window.performance, false);

  const output = {
    storage: browserStorage,
    ram: ram,
    network: connectionSpeed,
    battery: batteryLevel,
    performance: performance,
    browserMemory: {
      ...convertToObject(mem, false),
      usage: `${(mem.totalJSHeapSize / mem.jsHeapSizeLimit) * 100} percent`,
      comment:
        "units in bytes. percent is percent of allocated browser memory (multiple tabs included)"
    }
  };

  firebase
    .firestore()
    .collection("logs")
    .doc(daystamp)
    .collection("browser performance logs")
    .doc(timestamp)
    .set({ status: output }, { merge: true })
    .then(v => {
      callback && callback(v);
    })
    .catch(e => console.log("LOGGING ERROR: ", e));
};
