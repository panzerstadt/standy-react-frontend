import React, { useEffect } from "react";

import styles from "./index.module.css";

import { saveToLocalStorage, loadFromLocalStorage } from "../atoms";

const Logout = ({ onLogout }) => {
  const handleLogout = e => {
    const init = loadFromLocalStorage();
    saveToLocalStorage({ ...init, email: undefined });
    onLogout && onLogout();
  };

  return (
    <button className={styles.button} onClick={handleLogout}>
      log out
    </button>
  );
};

export default Logout;
