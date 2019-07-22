import React, { useState, useEffect, useReducer } from "react";
import { Link, Route, useLocation } from "wouter";

import "./App.css";
import styles from "./App.module.css";

import Record from "./pages/Record";
import Share from "./pages/Share";
import View from "./pages/View";
import Login from "./pages/Login";
import Logout from "./components/Logout";

const App = () => {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [location, setLocation] = useLocation();

  const handleLogin = e => {
    setUser(e);
    setLoggedIn(true);
  };

  const handleLogout = e => {
    setUser({});
    setLoggedIn(false);
  };

  if (!loggedIn)
    return (
      <div className={styles.app}>
        <Login onSuccess={handleLogin} />
      </div>
    );

  return (
    <div className={styles.app}>
      <div className={styles.login}>
        <h3>welcome {user.email} !</h3>
        <Logout onLogout={handleLogout} />
      </div>
      <header className={styles.page}>
        <Route path="/record">
          <Record user={user && user.email} />
        </Route>

        <Route path="/view">
          <View user={user && user.email} />
        </Route>
        <Route path="/share">
          <Share user={user && user.email} />
        </Route>
      </header>
      <footer className={styles.tabContainer}>
        <Link href="/record">
          <button
            className={`${styles.tab} ${location === "/record" &&
              styles.active}`}
          >
            Record
          </button>
        </Link>
        <Link href="/view">
          <button
            className={`${styles.tab} ${location === "/view" && styles.active}`}
          >
            View
          </button>
        </Link>
        <Link href="/share">
          <button
            className={`${styles.tab} ${location === "/share" &&
              styles.active}`}
          >
            Share
          </button>
        </Link>
      </footer>
    </div>
  );
};

export default App;
