import firebase from "../../libs/firebase";

const auth = firebase.auth();

export const sendVerificationEmail = callback => {
  const user = auth.currentUser;
  const emailCallback = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be whitelisted in the Firebase Console.
    url: "https://standy.firebaseapp.com/",
    handleCodeInApp: true
  };

  user.sendEmailVerification(emailCallback).then(() => {
    console.log("Please check your email for access");
    callback();
  });
};
