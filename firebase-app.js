import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence
} from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore
} from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";


// ==================================================
// FIREBASE
// ==================================================

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


// ==================================================
// GOOGLE PROVIDER
// ==================================================

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});


// ==================================================
// AUTH PERSISTENCE
// ==================================================

await setPersistence(
  auth,
  browserLocalPersistence
);


// ==================================================
// GOOGLE LOGIN
// ==================================================

export async function loginWithGoogle() {

  try {

    setLoginStatus("CONNECTING TO GOOGLE...");

    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    const user = result.user;

    console.log(
      "Google authentication successful:",
      user.uid
    );

    setLoginStatus(
      `AUTHENTICATED — ${user.displayName || user.email}`
    );

    return user;

  } catch (error) {

    console.error(
      "GOOGLE LOGIN ERROR:",
      error
    );

    let message = "Google authentication failed.";

    switch (error.code) {

      case "auth/popup-closed-by-user":
        message = "Google sign-in was cancelled.";
        break;

      case "auth/popup-blocked":
        message =
          "Your browser blocked the Google sign-in window. Allow popups for this site and try again.";
        break;

      case "auth/unauthorized-domain":
        message =
          "This website is not authorized in Firebase Authentication.";
        break;

      case "auth/operation-not-allowed":
        message =
          "Google Sign-In is not enabled in Firebase Authentication.";
        break;

      case "auth/network-request-failed":
        message =
          "Network connection failed. Check your connection and try again.";
        break;

      default:
        message =
          `${error.code || "UNKNOWN_ERROR"} — ${error.message || ""}`;
    }

    setLoginStatus(message);

    alert(message);

    throw error;
  }
}


// ==================================================
// LOGOUT
// ==================================================

export async function logout() {

  try {

    await signOut(auth);

    showLoginScreen();

  } catch (error) {

    console.error(
      "Logout failed:",
      error
    );
  }
}


// ==================================================
// AUTH GUARD
// ==================================================

export function requireGoogleLogin(callback) {

  return onAuthStateChanged(
    auth,
    async (user) => {

      if (!user) {

        showLoginScreen();

        return;
      }

      console.log(
        "AUTHENTICATED USER:",
        user.uid
      );

      hideLoginScreen();

      callback(user);
    }
  );
}


// ==================================================
// LOGIN SCREEN
// ==================================================

function showLoginScreen() {

  const loginScreen =
    document.getElementById("login-screen");

  const application =
    document.getElementById("application");

  if (loginScreen) {
    loginScreen.style.display = "flex";
  }

  if (application) {
    application.style.display = "none";
  }

  document.body.classList.add(
    "authentication-required"
  );
}


function hideLoginScreen() {

  const loginScreen =
    document.getElementById("login-screen");

  const application =
    document.getElementById("application");

  if (loginScreen) {
    loginScreen.style.display = "none";
  }

  if (application) {
    application.style.display = "block";
  }

  document.body.classList.remove(
    "authentication-required"
  );
}


// ==================================================
// STATUS
// ==================================================

function setLoginStatus(message) {

  const status =
    document.getElementById("login-status");

  const oldStatus =
    document.getElementById("authStatus");

  if (status) {
    status.textContent = message;
  }

  if (oldStatus) {
    oldStatus.textContent = message;
  }
}


// ==================================================
// BUTTON WIRING
// ==================================================

function wireGoogleButtons() {

  const buttons = [

    document.getElementById("google-login"),

    document.getElementById("googleLogin")

  ].filter(Boolean);


  buttons.forEach(button => {

    button.addEventListener(
      "click",
      async (event) => {

        event.preventDefault();

        button.disabled = true;

        try {

          await loginWithGoogle();

        } catch (_) {

          // Error already displayed.

        } finally {

          button.disabled = false;
        }
      }
    );

  });

}


// ==================================================
// START AUTH SYSTEM
// ==================================================

wireGoogleButtons();

onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      hideLoginScreen();

      console.log(
        "VIT PULSE SESSION ACTIVE:",
        user.email
      );

    } else {

      showLoginScreen();

    }

  }
);
