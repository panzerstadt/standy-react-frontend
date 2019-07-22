import firebase from "firebase";
import "firebase/performance";
import "firebase/auth";

const config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

const reactConfig = {};
Object.keys(config).map(v => {
  reactConfig[v] = process.env[`REACT_APP_${v}`];
});

if (!firebase.apps.length) {
  firebase.initializeApp(reactConfig);
}

// performance monitoring
const perf = firebase.performance();

export default firebase;
//module.exports = firebase;
