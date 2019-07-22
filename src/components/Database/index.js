import React, { useState, useEffect } from "react";
import firebase from "../../libs/firebase";

// timestamps
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import "dayjs/locale/ja";
dayjs.locale("ja");
dayjs.extend(minMax);

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

    const getSingleUserDataByDate = async (user, date = "2019-07-13") => {
      let res = await firebase
        .firestore()
        .collection("userTimeBin")
        .doc(user)
        .collection(date)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.docs.length === 0) {
            console.error("no querysnapshots found!");
            return [];
          }

          return querySnapshot.docs.map(doc => {
            return doc.data();
          });
        })
        .catch(e => console.error(e));
      return res;
    };

    // process data
    const convertRawDataToMatrix = data => {
      const matrixSize = {
        x: 50,
        y: 50
      };
      const bounds = {
        topLeft: {
          lat: 35.726635,
          lng: 139.67941
        },
        bottomRight: {
          lat: 35.64497384,
          lng: 139.7787656
        }
      };

      const boundsDummy = {
        topLeft: {
          lat: 35.53,
          lng: 139.68
        },
        bottomRight: {
          lat: 36.78,
          lng: 139.81
        }
      };

      const locs = data.map(v => v.location);

      // returns -1,-1 if either lat or lng is outside of bounds
      const mapLatLngToBounds = (lat, lng, x = 50, y = 50, bbox = bounds) => {
        const remap = (value, fromLow, fromHigh, toLow, toHigh) => {
          return (
            toLow +
            ((toHigh - toLow) * (value - fromLow)) / (fromHigh - fromLow)
          );
        };
        const remapCoord = (value, coordRange, outputRange) =>
          remap(
            value,
            coordRange[0],
            coordRange[1],
            outputRange[0],
            outputRange[1]
          );

        let result = { lat: undefined, lng: undefined };

        const rangeLat = [bbox.topLeft.lat, bbox.bottomRight.lat];
        const rangeLng = [bbox.topLeft.lng, bbox.bottomRight.lng];

        // if outside bounds, fill with -1
        const within = (value, range) => value >= range[0] && value <= range[1];
        if (!within(lat, rangeLat) || !within(lng, rangeLng))
          return { lat: -1, lng: -1 };

        // remaps lat lng from raw data to 0-49 (array of 50)
        result.lat = remapCoord(lat, rangeLat, [0, x - 1]);
        result.lng = remapCoord(lng, rangeLng, [0, y - 1]);

        return result;
      };

      // map all coordinates to integers 0-50
      const mapped = locs.map(c => {
        const m = mapLatLngToBounds(c.lat, c.lng, matrixSize.x, matrixSize.y);
        return { y: Math.round(m.lat), x: Math.round(m.lng) };
      });

      // not used, but fun
      const bin = (data, numBins) => {
        // https://www.answerminer.com/blog/binning-guide-ideal-histogram
        const maxVal = Math.max(data);
        const minVal = Math.min(data);
        const binWidth = numBins;

        return Math.ceil((maxVal - minVal) / binWidth);
      };

      // not a matrix, but a list of items to fill
      const randomMapped = Array.from({ length: 100 }).map(_ => ({
        x: Math.round(Math.random() * 49),
        y: Math.round(Math.random() * 49)
      }));

      // https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript
      const cleanDuplicates = data =>
        data.filter(
          (d, i) => i === data.findIndex(v => v.x === d.x && v.y === d.y)
        );

      const createEmptyArray = (x = 50, y = 50, fill = 0) => {
        return Array.from({ length: y }).map(_ =>
          Array.from({ length: x }).fill(fill)
        );
      };

      const cleaned = cleanDuplicates(mapped);
      console.log("cleaned: ", cleaned);

      // array[y][x]
      // let empty = createEmptyArray();
      // empty[0][0] = 100;

      const buildOriginalDepartureMaps = userCoordsData => {
        // the one that the user promises to reduce
        // [[0,0,0,0,-1,-1,-1,0,0,0], [0,-1,-1,0,0,0]]
        let arr = createEmptyArray(matrixSize.x, matrixSize.y, 0);
        userCoordsData.map(coord => (arr[coord.y][coord.x] = 1));

        return arr;
      };

      const newMap = buildOriginalDepartureMaps(cleaned);

      const buildOffPeakDepartureMaps = () => {
        // the one that is currently tracking
        // [[0,0,0,0,1,1,1,0,0,0], [0,1,1,0,0,0]]
        return [[], []];
      };

      return newMap;
    };

    const getUserData = async user => await getSingleUserDataByDate(user);

    const getUserMatrix = data => convertRawDataToMatrix(data);

    const getUserTime = data => {
      const day = dayjs(data[0].date).format("YYYY-MM-DD");

      const times_dayjs = data.map(d => dayjs(day + ":" + d.time));

      const originals = data.map(d => d.departureTime);
      const originalTime = Array.from(new Set(originals))[0]; // TODO: handle multiple departureTime check
      const original_dayjs = dayjs(day + ":" + originalTime);

      const offPeakStartTime = dayjs.min(times_dayjs);
      const offPeakEndTime = dayjs.max(times_dayjs);

      const originalStartTime = original_dayjs;
      const period = offPeakEndTime - offPeakStartTime;
      const originalEndTime = original_dayjs.add(period);

      const out = dayjsTime => dayjsTime.format("HH:mm");

      return {
        offPeak: {
          start: out(offPeakStartTime),
          end: out(offPeakEndTime)
        },
        original: {
          start: out(originalStartTime),
          end: out(originalEndTime)
        }
      };
    };

    const run = async () => {
      const userData = await getUserData(user);

      const userMatrix = getUserMatrix(userData);
      const userTime = getUserTime(userData);

      const output = {
        date: "2019-07-13 - this is a dummy",
        time: userTime,
        matrix: JSON.stringify(userMatrix)
      };

      await firebase
        .firestore()
        .collection(collection)
        .doc(user)
        .set(output);

      console.log(output);
    };

    run();

    // push back to firebase
    const pushMatrixToUser = () => {};

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
