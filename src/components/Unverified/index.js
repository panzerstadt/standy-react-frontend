import React from "react";
import { motion } from "framer-motion";

import styles from "./index.module.css";

import { loadFromLocalStorage, saveToLocalStorage } from "../atoms";
import firebase from "../../libs/firebase";

const Unverified = ({ email }) => {
  const handleLogout = e => {
    const init = loadFromLocalStorage();
    saveToLocalStorage({ ...init, email: undefined });
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("signed out.");
      })
      .catch(e => {
        console.error("signout error", e);
      });
  };

  return (
    <div className={styles.container}>
      <h1>thanks for signing up!</h1>
      <h3>
        please visit your inbox to verify your email address{" "}
        <strong style={{ color: "#00aced" }}>{email}</strong>, and we can get
        rolling!
      </h3>
      <motion.a href="/" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3
          style={{
            color: "#00aced",
            cursor: "pointer",
            textDecoration: "none"
          }}
          onClick={handleLogout}
        >
          Not you?
        </h3>
      </motion.a>
    </div>
  );
};

export default Unverified;
