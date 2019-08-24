import React, { useEffect } from "react";

import styles from "./index.module.css";

import { saveToLocalStorage, loadFromLocalStorage } from "../atoms";
import firebase from "../../libs/firebase";

const Logout = ({ onLogout }) => {
  const handleLogout = e => {
    const init = loadFromLocalStorage();
    saveToLocalStorage({ ...init, email: undefined });
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("signed out.");
        onLogout && onLogout();
      })
      .catch(e => {
        console.error("signout error", e);
      });
  };

  return (
    <button className={styles.button} onClick={handleLogout}>
      log out
    </button>
  );
};

export default Logout;
