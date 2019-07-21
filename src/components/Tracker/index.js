import React, { useState, useEffect } from "react";

import { pushRecordToDatabase } from "../Database";
import useInterval from "../atoms/useInterval";

import styles from "./index.module.css";

// timestamps
import dayjs from "dayjs";
import "dayjs/locale/ja";
dayjs.locale("ja");

const Tracker = ({
  continuousTracking,
  user,
  trainLine,
  departureTime,
  onSuccess
}) => {
  const [localRecord, setLocalRecord] = useState([]);
  const date = dayjs().format("YYYY-MM-DD");

  const sec = 10;
  const milli = sec * 1000;

  const [locEnabled, setLocEnabled] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  useEffect(() => {
    let id;
    const options = {
      enableHighAccuracy: false,
      timeout: 10000
    };
    const locError = e => {
      alert("sorry, you need geolocation enabled for this to work!", e);
      setLocEnabled(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(updateLocation, locError, options);
      setLocEnabled(true);
    } else {
      locError();
    }
  }, []);

  const updateLocation = e => {
    const coords = { lat: e.coords.latitude, lng: e.coords.longitude };
    setLocation(coords);
  };

  const [isContinuous, setIsContinuous] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  useEffect(() => {
    if (isTracking) {
      if (isContinuous) {
        console.log("tracking continuously!");
      } else {
        console.log("tracking in batches!");
        handleLocalRecord();
      }
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
    onSuccess && onSuccess();
  };

  const handleTrackContinuous = () => {
    setIsContinuous(p => {
      continuousTracking && continuousTracking(!p);
      return !p;
    });
  };

  return locEnabled ? (
    <div>
      <h3>start tracking your journey today!</h3>
      <button
        style={{
          padding: "5px 10px",
          backgroundColor: isContinuous ? "red" : "white",
          border: "1px solid black",
          borderRadius: 15
        }}
        onClick={handleTrackContinuous}
      >
        continuous tracking {isContinuous ? "on" : "off"}
      </button>
      <br />
      <button className={styles.button} onClick={handleStart}>
        start tracking
      </button>
      <br />
      <button className={styles.button} onClick={handleEnd}>
        end tracking
      </button>
    </div>
  ) : (
    <div>
      <h3>please use a geolocation enabled browser.</h3>
    </div>
  );
};

export default Tracker;
