import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

import styles from "./index.module.css";

import { loadFromLocalStorage, saveToLocalStorage } from "../atoms";
import firebase from "../../libs/firebase";
import { sendVerificationEmail } from "../Auth";

const Unverified = ({ email }) => {
  const [resent, setResent] = useState(false);

  const handleLogout = e => {
    const init = loadFromLocalStorage();
    saveToLocalStorage({ ...init, email: undefined });
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("signed out.");
        ref.current.click();
      })
      .catch(e => {
        console.error("signout error", e);
      });
  };

  const handleSendEmail = () => {
    sendVerificationEmail(() => setResent(true));
  };

  const ref = useRef();

  return (
    <div className={styles.container}>
      <h1>thanks for signing up!</h1>
      <h3 style={{ maxWidth: 400 }}>
        please visit your inbox to verify your email address{" "}
        <strong style={{ color: "#00aced" }}>{email}</strong>, and we can get
        rolling!
      </h3>
      <div>
        <h3
          style={{
            color: "#00aced",
            cursor: "pointer",
            textDecoration: "none",
            margin: "0 10px"
          }}
          onClick={handleSendEmail}
        >
          {resent ? "sent!" : "send verification email again"}
        </h3>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: "#00aced",
            cursor: "pointer",
            textDecoration: "none"
          }}
          onClick={handleLogout}
        >
          Not you?
        </motion.h3>
        <a href="/" ref={ref}></a>
      </div>
    </div>
  );
};

export default Unverified;
