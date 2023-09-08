// src/App.js
import React from "react";
import "./App.css";
import Leaderboard from "./Leaderboard";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';



const firebaseConfig = {
    apiKey: "AIzaSyCI7kdhzDVF5kfX6LmaZROQWFJB4IwfLAs",
    authDomain: "leaderboard-76800.firebaseapp.com",
    projectId: "leaderboard-76800",
    storageBucket: "leaderboard-76800.appspot.com",
    messagingSenderId: "962428982516",
    appId: "1:962428982516:web:1b1f4dff1dc68808a8faa1",
    measurementId: "G-YYBTS4GRW7"
  };

const app = firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();



function App() {


  return (
    <div className="App">
      <Leaderboard />
    </div>
  );
}

export default App;

