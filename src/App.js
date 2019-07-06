import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import Login from "./components/Login";
import Tracker from "./components/Tracker";
import TrainLine from "./components/TrainLine";
import DepartureTime from "./components/DepartureTime";

function App() {
  const [trackContinuously, setTrackContinuously] = useState(false);
  const [trainLine, setTrainLine] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [user, setUser] = useState({});
  useEffect(() => {});

  const handleLogin = e => {
    setUser(e);
  };

  const handleSelectTrainLine = e => {
    setTrainLine(e);
  };

  const handleDepartureTime = e => {
    setDepartureTime(e);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Login onSuccess={handleLogin} />
        <button
          style={{
            padding: "5px 10px",
            backgroundColor: trackContinuously ? "red" : "white",
            border: "1px solid black",
            borderRadius: 15
          }}
          onClick={() => setTrackContinuously(p => !p)}
        >
          track continuously?
        </button>
        <Tracker
          user={user && user.email}
          continuousTracking={trackContinuously}
          trainLine={trainLine}
          departureTime={departureTime}
        />
        <TrainLine onSelect={handleSelectTrainLine} />
        <DepartureTime onSuccess={handleDepartureTime} />
        {/* <FireStoreState user={user && user.email} /> */}
      </header>
    </div>
  );
}

export default App;
