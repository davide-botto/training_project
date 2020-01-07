import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDThevYSG9Ekz-4ADxbxerDJlijLbPsGHw",
    authDomain: "enrolled-students.firebaseapp.com",
    databaseURL: "https://enrolled-students.firebaseio.com",
    projectId: "enrolled-students",
    storageBucket: "enrolled-students.appspot.com",
    messagingSenderId: "936677838906",
    appId: "1:936677838906:web:a892fea0d7c4ad07036503"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export const db = firebase.firestore();
  export const auth = firebase.auth();
  