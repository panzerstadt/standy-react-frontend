import React, { useState, useEffect, useReducer } from "react";
import { Link, Route, useLocation } from "wouter";
import { motion } from "framer-motion";

import "./App.css";
import styles from "./App.module.css";

import Record from "./pages/Record";
import Share from "./pages/Share";
import View from "./pages/View";
import Login from "./pages/Login";
import Logout from "./components/Logout";
import Unverified from "./components/Unverified";
import { clearLocalStorage } from "./components/atoms";

const App = () => {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [verified, setVerified] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (loggedIn) {
      console.log("verified? ", user.verified);
      user.verified && setVerified(user.verified);
    }
    return () => {
      setVerified(false);
    };
  }, [loggedIn]);

  const handleLogin = e => {
    setUser(e);
    setLoggedIn(true);
  };

  const handleLogout = e => {
    setUser({});
    setLoggedIn(false);
  };

  const handleClearStorage = e => {
    clearLocalStorage();
  };

  if (!loggedIn)
    return (
      <div className={styles.app}>
        <Login onSuccess={handleLogin} onClearStorage={handleClearStorage} />
      </div>
    );

  if (!verified) {
    return <Unverified email={user.email} />;
  }

  if (loggedIn && verified) {
    return (
      <motion.div
        className={styles.app}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
      >
        <div className={styles.login}>
          <h3>welcome {(user && user.username) || user.email} !</h3>
          <Logout onLogout={handleLogout} />
        </div>
        <header className={styles.page}>
          <Route path="/">
            <h3>click on Record to start!</h3>
          </Route>
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
              className={`${styles.tab} ${location === "/view" &&
                styles.active}`}
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
      </motion.div>
    );
  }

  return (
    <div>
      <h1>hoo.. something's wrong.</h1>
    </div>
  );
};

export default App;
