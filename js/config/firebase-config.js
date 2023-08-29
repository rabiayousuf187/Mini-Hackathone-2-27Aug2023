  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
  import { getDatabase, ref, push, set, get, remove, update } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
  import { getStorage, ref as storageRef, getDownloadURL, uploadBytes} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
  // import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
  
  
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBLhhXmdNIjrWSHEYNoSSZaS84mSfStvp4",
  authDomain: "personalblogappminihack-aug-23.firebaseapp.com",
  databaseURL: "https://personalblogappminihack-aug-23-default-rtdb.firebaseio.com",
  projectId: "personalblogappminihack-aug-23",
  storageBucket: "personalblogappminihack-aug-23.appspot.com",
  messagingSenderId: "489857459770",
  appId: "1:489857459770:web:d7001fd80eb71d5679b703",
  measurementId: "G-E9VX98NWJL"
  };

  // Initialize Firebase
  const appInitial = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(appInitial);
    // Create a reference to the Firebase Realtime Database
const database = getDatabase();
  // const analytics = getAnalytics(firebase);

  const storage = getStorage();



  // ***************************************************** Firebase Web Own Auth
// Check if userAcc exists in localStorage
// const userAcc = JSON.parse(localStorage.getItem("userAcc"));
// Conditionally export Firebase functions
// let firebaseExports = null;

// if (userAcc === null) {
  let firebaseExports = {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    database,
    ref,
    push,
    set,
    remove,
    push,
    update,
    get,
    storage,
    storageRef, 
    getDownloadURL, uploadBytes,
  };
// }

export default firebaseExports;
  // export {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, database, ref, push, set, get};