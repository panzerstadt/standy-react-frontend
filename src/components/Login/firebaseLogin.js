import { useEffect, useState } from "react";
import firebase from "../../libs/firebase";

const auth = firebase.auth();

export const useCheck = email => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const [current, setCurrent] = useState(email);
  const [exists, setExists] = useState(false);
  useEffect(() => {
    current &&
      auth.fetchSignInMethodsForEmail(current).then(user => {
        console.log("does this user exist? ", user);
        user.length > 0 && setExists(true);
      });
  }, [current, users]);

  useEffect(() => {
    error && console.error(error);
  }, [error]);

  return [exists, setCurrent];
};

export const useSignIn = ({ email, password }) => {
  const [debug, setDebug] = useState("");
  const [check, setCheck] = useState({ email: email, password: password });
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    if ((check.email && check.password) || (email && password)) {
      try {
        const e = check.email || email;
        const p = check.password || password;
        auth
          .signInWithEmailAndPassword(e, p)
          .then(usr => console.log("authenticated", usr))
          .catch(e =>
            setAuthenticated({ authenticated: false, error: e.message })
          );
      } catch (e) {
        console.log(e);
        setDebug(e);
      }
    }
  }, [email, password, check]);

  auth.onAuthStateChanged(user => {
    if (user) {
      const usr = auth.currentUser;
      setAuthenticated({
        authenticated: true,
        verified: usr.emailVerified,
        username: usr.displayName,
        email: usr.email
      });
    }
  });

  return [authenticated, setCheck];
};

export const useSignUp = ({ email, password, nickname }) => {
  const [debug, setDebug] = useState("");
  const [check, setCheck] = useState({
    email: email,
    password: password,
    nickname: nickname
  });

  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    if (
      (check.email && check.password && check.nickname) ||
      (email && password && nickname)
    ) {
      try {
        const e = check.email || email;
        const p = check.password || password;
        const n = check.nickname || nickname;

        console.log(p, e, n);

        auth.createUserWithEmailAndPassword(e, p).then(user => {
          const newUser = auth.currentUser;
          return newUser.updateProfile({
            displayName: n || e
          });
        });
      } catch (e) {
        console.error(e);
        setDebug(e);
      }
    }
  }, [email, password, check]);

  return [authenticated, setCheck];
};
