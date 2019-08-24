import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Yup from "yup";

import { useCheck, useSignIn, useSignUp } from "./firebaseLogin";
import Form from "../Formik";
import { saveToLocalStorage, loadFromLocalStorage } from "../atoms";

const Error = ({ text }) => {
  return <p style={{ color: "red" }}>{text}</p>;
};

const UserInfo = ({ onSuccess, onError, onClearStorage }) => {
  const [user, setUser] = useState({ email: undefined });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const initUser = loadFromLocalStorage().email;
    initUser && setUser({ email: initUser });
  }, []);

  const [authenticated, setAuthenticated] = useState(false);
  const [isReturningUser, setCheckReturningUser] = useCheck();
  useEffect(() => {
    if (user.email) {
      // load previous email
      const init = loadFromLocalStorage();
      saveToLocalStorage({ ...init, ...user });

      // authenticate
      setCheckReturningUser(user.email);
      setReady(false);
    }
  }, [user]);

  const [authReturningUser, setAuthReturningUser] = useSignIn({});
  const [authNewUser, setAuthNewUser] = useSignUp({});
  const [error, setError] = useState("");
  useEffect(() => {
    if (isReturningUser) {
      // ask for password
      setReady(true);
    } else {
      // sign up
      setReady(true);
    }
  }, [isReturningUser]);

  useEffect(() => {
    if (authReturningUser) {
      switch (authReturningUser.authenticated) {
        case true:
          onSuccess && onSuccess(authReturningUser);
          break;
        case false:
          setError(authReturningUser.error);
          break;
        default:
          setError(
            "we're sorry, but there seems to be a problem with signing in. please contact support at tliqun@gmail.com"
          );
          break;
      }
    } else if (authNewUser) {
      switch (authNewUser.authenticated) {
        case true:
          onSuccess && onSuccess(authNewUser);
          break;
        case false:
          setError(authNewUser.error);
          break;
        default:
          setError(
            "we're sorry, but there seems to be a problem with signing up. please contact support at tliqun@gmail.com"
          );
          break;
      }
    } else if (authenticated) {
      onSuccess && onSuccess(user);
    }
  }, [authenticated, authReturningUser]);

  useEffect(() => {
    onError && onError(error);
  }, [error]);

  const handleSubmit = e => {
    setUser(e);
    setReady(false);
  };

  const handleSubmitReturningUser = e => {
    setAuthReturningUser(e);
  };

  const handleSubmitNewUser = e => {
    setAuthNewUser(e);
  };

  if (user.email && isReturningUser && ready) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Form
          key="returning-user"
          template="login"
          successText="Logging in..."
          title="Sign In."
          text="welcome back!"
          initialValues={{ email: user.email }}
          onSubmit={handleSubmitReturningUser}
        />
        <motion.a href="/" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3
            style={{
              color: "#00aced",
              cursor: "pointer",
              textDecoration: "none"
            }}
            onClick={() => onClearStorage && onClearStorage()}
          >
            Not you?
          </h3>
        </motion.a>
      </div>
    );
  } else if (user.email && ready) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Form
          key="new-user"
          template="signup"
          successText="thank you!"
          title="Sign Up"
          text="and join the offpeak movement!"
          initialValues={{ email: user.email }}
          onSubmit={handleSubmitNewUser}
          validationSchema={Yup.object().shape({
            nickname: Yup.string().required("what should we call you?"),
            email: Yup.string()
              .email()
              .required("email required!"),
            password: Yup.string()
              .min(8)
              .strict()
              .required("password required!")
          })}
        />
        <motion.a href="/" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3
            style={{
              color: "#00aced",
              cursor: "pointer",
              textDecoration: "none"
            }}
            onClick={() => onClearStorage && onClearStorage()}
          >
            Not you?
          </h3>
        </motion.a>
      </div>
    );
  } else if (ready) {
    // just email, to check which user you are
    return (
      <Form
        key="new"
        template="email"
        successText="checking"
        title="Join the Movement"
        text="help reduce congestion during the olympics!"
        onSubmit={handleSubmit}
      />
    );
  } else {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>Loading...</h1>
      </motion.div>
    );
  }
};

const Login = props => {
  const [error, setError] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <UserInfo onError={setError} {...props} />
      <Error text={error} />
    </div>
  );
};

export default Login;
