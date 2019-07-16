import React, { useState, useEffect } from "react";

import Form from "../Formik";
import { saveToLocalStorage, loadFromLocalStorage } from "../atoms";

const UserInfo = ({ onSuccess }) => {
  const [time, setTime] = useState({ time: null });
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const init = loadFromLocalStorage();
    const initTime = init.time;
    initTime && setTime({ time: initTime });

    return () => setSubmitted(false);
  }, []);
  useEffect(() => {
    if (time.time && submitted) {
      const local = loadFromLocalStorage();
      saveToLocalStorage({ ...local, ...time });
      onSuccess && onSuccess(time);
    }
  }, [time, submitted]);

  const handleSubmit = e => {
    setSubmitted(true);

    e.preventDefault();
  };

  const handleUpdateTime = e => {
    setTime({ time: e.target.value });
  };

  return (
    <div>
      {submitted ? (
        <p>your departure time: {time && time.time}</p>
      ) : (
        <>
          <p>what is your usual departure time?</p>
          <form onSubmit={handleSubmit}>
            <input type="time" onChange={handleUpdateTime} />
            <input type="submit" value="Submit" />
          </form>
        </>
      )}
    </div>
  );
};

export default UserInfo;
