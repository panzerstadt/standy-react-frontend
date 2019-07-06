import React, { useState, useEffect } from "react";

import { pushRecordToDatabase } from "../Database";
import useInterval from "../atoms/useInterval";

import styles from "./index.module.css";

// timestamps
import dayjs from "dayjs";
import "dayjs/locale/ja";
dayjs.locale("ja");

function getLocation() {
  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition();
  } else {
    console.log("Geolocation is not supported by this browser.");
    return false;
  }
}

const Tracker = ({
  continuousTracking = false,
  user,
  trainLine,
  departureTime
}) => {
  const [localRecord, setLocalRecord] = useState([]);
  const date = dayjs().format("YYYY-MM-DD");

  const sec = 10;
  const milli = sec * 1000;

  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  useEffect(() => {
    let id;
    const options = {
      enableHighAccuracy: false,
      timeout: 10000
    };
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        updateLocation,
        e => console.log("location erorr: ", e),
        options
      );
    } else {
      alert("sorry, this browser does not support geolocation!");
    }
  }, []);

  const updateLocation = e => {
    const coords = { lat: e.coords.latitude, lng: e.coords.longitude };
    setLocation(coords);
  };

  const [isContinuous, setIsContinuous] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  useEffect(() => {
    if (isTracking) {
      if (continuousTracking) {
        console.log("tracking continuously!");
        setIsContinuous(true);
      } else {
        console.log("tracking in batches!");
        handleLocalRecord();
      }
    } else {
      isContinuous && setIsContinuous(false);
    }
  }, [isTracking, continuousTracking]);

  useInterval(
    () => {
      handleLocalRecord();
      isContinuous && handlePushToDatabase();
    },
    isTracking ? milli : null
  );

  const handlePushToDatabase = e => {
    const rec = localRecord.slice(-1)[0];
    pushRecordToDatabase({ user: user, data: rec });
  };

  const handleLocalRecord = e => {
    const time = dayjs().format("HH:mm:ss");

    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(updateLocation);
    // }

    let currentRecord = localRecord.slice();
    const newRecord = [
      ...currentRecord,
      {
        location: location,
        date: date,
        time: time,
        trainLine: trainLine,
        departureTime: departureTime
      }
    ];
    console.log(newRecord);
    setLocalRecord(newRecord);
  };

  const handleStart = e => {
    console.log("tracking statrt!");
    setLocalRecord([]);
    setIsTracking(true);
  };

  const handleEnd = e => {
    console.log("tracking end");
    setIsTracking(false);
  };
  return (
    <div>
      <h3>start tracking your journey today!</h3>
      <button className={styles.button} onClick={handleStart}>
        start tracking
      </button>
      <br />
      <button className={styles.button} onClick={handleEnd}>
        end tracking
      </button>
      <br />
      {`${isTracking}`}
    </div>
  );
};

export default Tracker;
