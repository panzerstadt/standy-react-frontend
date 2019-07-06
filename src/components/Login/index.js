import React, { useState, useEffect } from "react";

import Form from "../Formik";
import { saveToLocalStorage, loadFromLocalStorage } from "../atoms";

const UserInfo = ({ onSuccess }) => {
  const [user, setUser] = useState({ email: null });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const initUser = loadFromLocalStorage().email;
    initUser && setUser({ email: initUser });
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (user.email) {
      saveToLocalStorage(user);

      onSuccess && onSuccess(user);
    }
  }, [user]);

  const handleSubmit = e => {
    console.log(e);
    setUser(e);
  };

  return (
    <div>
      {loaded && !user.email ? (
        <Form
          template="email"
          successText="thank you!"
          title="Join the Movement"
          text="help reduce congestion during the olympics!"
          onSubmit={handleSubmit}
        />
      ) : (
        user.email && <p>Hello {user.email} !</p>
      )}
    </div>
  );
};

export default UserInfo;
