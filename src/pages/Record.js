import React, { useState, useEffect, useReducer } from "react";

import Tracker from "../components/Tracker";
import TrainLine from "../components/TrainLine";
import DepartureTime from "../components/DepartureTime";
import Message from "../components/EndMessage";
import { FireStoreState, FireStoreDEBUG } from "../components/Database";

const taskReducer = (state, action) => {
  const stat = action.hasOwnProperty("status");
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        login: stat ? action.status : true
      };
    case "TRAINLINE":
      return { ...state, trainLine: action.status ? action.status : true };
    case "TRACKER":
      return { ...state, tracker: action.status ? action.status : true };
    case "DEPARTURE_TIME":
      return { ...state, departureTime: action.status ? action.status : true };
    case "COMPLETE":
      return { ...initState, complete: true };
    default:
      alert("no action taken to task reducer");
      return state;
  }
};

const initState = {
  login: false,
  trainLine: false,
  tracker: false,
  departureTime: false,
  complete: false
};

const Record = ({ user }) => {
  // handles what to show
  const [sections, dispatch] = useReducer(taskReducer, initState);

  const [trainLine, setTrainLine] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  useEffect(() => {
    // skipping departure time for now
    dispatch({ type: "DEPARTURE_TIME", status: true });
  }, []);

  const handleSelectTrainLine = e => {
    setTrainLine(e);
    dispatch({ type: "DEPARTURE_TIME", status: true });
  };

  const handleDepartureTime = e => {
    setDepartureTime(e && e.time);
    dispatch({ type: "TRACKER" });
  };

  const handleTrackSuccess = e => {
    console.log("complete!");
    dispatch({ type: "COMPLETE", status: true });
  };

  return (
    <div>
      {/* 1 */}
      {/* {sections.trainLine && <TrainLine onSelect={handleSelectTrainLine} />} */}
      {/* 2 */}
      {sections.departureTime && (
        <DepartureTime onSuccess={handleDepartureTime} />
      )}
      {/* 3 */}
      {sections.tracker && (
        <Tracker
          user={user}
          trainLine={trainLine}
          departureTime={departureTime}
          onSuccess={handleTrackSuccess}
        />
      )}
      {/* 4 */}
      {sections.complete && <Message />}
      {/* <FireStoreState user={user && user.email} />
        <FireStoreDEBUG user={user && user.email} /> */}
    </div>
  );
};

export default Record;
