import React, { useState, useEffect, useReducer } from "react";
import "./App.css";

import Login from "./components/Login";
import Tracker from "./components/Tracker";
import TrainLine from "./components/TrainLine";
import DepartureTime from "./components/DepartureTime";
import { FireStoreState, FireStoreDEBUG } from "./components/Database";

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

function App() {
  // handles what to show
  const [sections, dispatch] = useReducer(taskReducer, initState);

  const [trainLine, setTrainLine] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    // initialize by showing login
    dispatch({ type: "LOGIN", status: true });
  }, []);

  const handleLogin = e => {
    setUser(e);
    dispatch({ type: "TRAINLINE", status: true });
  };

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
    <div className="App">
      <header className="App-header">
        {/* 1 */}
        {sections.login && <Login onSuccess={handleLogin} />}
        {/* 2 */}
        {sections.trainLine && <TrainLine onSelect={handleSelectTrainLine} />}
        {/* 3 */}
        {sections.departureTime && (
          <DepartureTime onSuccess={handleDepartureTime} />
        )}
        {/* 4 */}
        {sections.tracker && (
          <Tracker
            user={user && user.email}
            trainLine={trainLine}
            departureTime={departureTime}
            onSuccess={handleTrackSuccess}
          />
        )}
        {/* 5 */}
        {sections.complete && (
          <>
            <h3>thank you very much for participating!</h3>
            <h5>refresh the browser if you want to start again.</h5>
          </>
        )}
        <FireStoreState user={user && user.email} />
        <FireStoreDEBUG user={user && user.email} />
      </header>
    </div>
  );
}

export default App;
