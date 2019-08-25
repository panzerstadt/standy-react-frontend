import { useEffect, useState } from "react";
import firebase from "../../libs/firebase";

const auth = firebase.auth();

export const useCheck = email => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const [current, setCurrent] = useState(email);
  const [exists, setExists] = useState(null);
  useEffect(() => {
    current &&
      auth
        .fetchSignInMethodsForEmail(current)
        .then(user => {
          console.log("does this user exist? ", user.length > 0);
          if (user.length > 0) {
            setExists(true);
          } else {
            setExists(false);
          }
        })
        .catch(e => console.log("user check error: ", e));
    return () => {
      setExists(null);
    };
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
          .then(usr => console.log("authenticated", usr.displayName))
          .catch(e =>
            setAuthenticated({ authenticated: false, error: e.message })
          );
      } catch (e) {
        console.log(e);
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

  const emailCallback = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be whitelisted in the Firebase Console.
    url: "https://standy.firebaseapp.com/",
    handleCodeInApp: true
  };

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

        auth.createUserWithEmailAndPassword(e, p).then(user => {
          const newUser = auth.currentUser;
          newUser.updateProfile({
            displayName: n || e
          });

          return newUser
            .sendEmailVerification()
            .then(() => {
              console.log("Please check your email for access");
            })
            .catch(e => console.log("email verification error!"));
        });
      } catch (e) {
        console.error(e);
        setDebug(e);
      }
    }
  }, [email, password, check]);

  return [authenticated, setCheck];
};
