// does not work YET
// TODO: connect logic to view
// https://firebase.google.com/docs/auth/web/email-link-auth

import firebase from "../../libs/firebase";

(function() {
  // Get elements
  const txtEmail = document.getElementById("txtEmail");
  const txtPassword = document.getElementById("txtPassword");
  const btnLogin = document.getElementById("btnLogin");
  const btnSignUp = document.getElementById("btnSignUp");
  const btnLogout = document.getElementById("btnLogout");

  // Add login event
  btnLogin.addEventListener("click", e => {
    //Get email and pass
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    //Sign in
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log("SIGN IN ERROR: ", e.message));
  });

  // Add signup event
  btnSignUp.addEventListener("click", e => {
    // Get email and pass
    //TODO: CHECK FOR REAL EMAIL
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    //Sign in
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
  });

  btnLogout.addEventListener("click", e => {
    firebase.auth().signOut();
  });

  //Add a realtime listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      console.log(firebaseUser);
      btnLogout.classList.remove("hide");
    } else {
      console.log("User not logged in");
      btnLogout.classList.add("hide");
    }
  });
})();
