import React, { useState, useEffect } from "react";

import Form from "../Formik";
import { saveToLocalStorage, loadFromLocalStorage } from "../atoms";

const MESSAGES = [
  "I hope that people will enjoy their utmost during the Tokyo Olympics!",
  "Fill Tokyo with smiles in 2020!",
  "We would be glad if visitors love Tokyo!",
  "Enjoy 2020!",
  "We must do our part in making this the most beautiful Olympics!"
];

const Message = ({ onSuccess }) => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({ email: null });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const initUser = loadFromLocalStorage().email;
    initUser && setUser({ email: initUser });
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (user.email) {
      const init = loadFromLocalStorage();
      saveToLocalStorage({ ...init, ...user });

      onSuccess && onSuccess(user);
    }
  }, [user]);

  const handleSubmit = e => {
    console.log(e);
    setMessage(e);
  };

  const msgInd = Math.round(Math.random() * MESSAGES.length);

  return (
    <div>
      {loaded && !message ? (
        <Form
          template="text"
          successText="thank you!"
          title="Leave a Message"
          text="we encourage you to leave a message below to share your goodwill
          with everyone who will visit Tokyo!"
          placeholder={MESSAGES[msgInd]}
          onSubmit={handleSubmit}
        />
      ) : (
        <p>
          Thank you very much! we will make sure that your goodwill will be
          spread to all visitors of Tokyo!
        </p>
      )}
    </div>
  );
};

export default Message;
