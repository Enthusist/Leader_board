import React, { useState, useEffect } from "react";
import "./Leaderboard.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCI7kdhzDVF5kfX6LmaZROQWFJB4IwfLAs",
  authDomain: "leaderboard-76800.firebaseapp.com",
  projectId: "leaderboard-76800",
  storageBucket: "leaderboard-76800.appspot.com",
  messagingSenderId: "962428982516",
  appId: "1:962428982516:web:1b1f4dff1dc68808a8faa1",
  measurementId: "G-YYBTS4GRW7"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();


function Leaderboard() {
  const [inputValue, setInputValue] = useState("");
  const [inputValuec, setInputValuec] = useState("");

  const [codeEntered, setCodeEntered] = useState(0);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputChangec = (e) => {
    setInputValuec(e.target.value);
  };

  const addPlayer = async () => {
    if (inputValue.trim() !== "") {
      await firestore.collection("players").add({
        name: inputValue,
        score: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setInputValue("");
    }
  };


  

  const query = firestore.collection("players").orderBy("score", "desc"); // Order by score in descending order

  const [playerData] = useCollectionData(query);

  
  const updateScore = async (name, value) => {
    try {
      // Query for the player document with the matching name
      const querySnapshot = await firestore
        .collection("players")
        .where("name", "==", name)
        .get();
  
      // Check if there is a matching player
      if (!querySnapshot.empty) {
        // Update the first matching player found (you can adjust this logic if needed)
        const playerDoc = querySnapshot.docs[0];
        const currentScore = playerDoc.data().score;
        const newScore = currentScore + value;
  
        // Update the player's score in Firestore
        await playerDoc.ref.update({ score: newScore });
      } else {
        console.error(`Player with name "${name}" not found.`);
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };
  

  const removePlayer = async (name) => {
    try {

      const querySnapshot = await firestore
        .collection("players")
        .where("name", "==", name)
        .get();
  
      if (!querySnapshot.empty) {

        const playerDoc = querySnapshot.docs[0];
        await playerDoc.ref.delete();
      } else {
        console.error(`Player with name "${name}" not found.`);
      }
    } catch (error) {
      console.error("Error removing player:", error);
    }
  };
  
// console.log('+=>',query);

const sortedPlayerData = playerData
  ? [...playerData].sort((a, b) => b.score - a.score)
  : [];



  const handleCodeSubmit = () => {
    // Check if the entered code is correct (e.g., "mySecretCode")
    if (inputValuec.trim() === "um6p") {
      setCodeEntered(2);
    }
    if (inputValuec.trim() === "fmsbreak") {
      setCodeEntered(1);
    }

  };


   if (codeEntered === 0) {
    return (
      <div className="csoc">
        <h1 className="whi">Enter Code</h1>
        <div className="fsoc">
          <div>
            <input
              className="ye"
              type="text"
              placeholder="code is um6p"
              value={inputValuec}
              onChange={handleInputChangec}
            />
          </div>
          <div>
            <button className="sus_button" onClick={handleCodeSubmit}>
              Submit Code
            </button>
          </div>
        </div>
        <div>
          <h2>The rules:</h2>
          <p className="t">Each team is given a limited number of tickets</p>
          <p className="t">Playing costs your team tickets so spend them wisely</p>
          <p className="t">Each turn in a game costs one ticket</p>
          <p className="t">Winning a game gives a certain number of points :</p>
          <p className="t">Team vs team game : 3pts for the winner</p>
          <p className="t">Multiple teams ex: 1st = 5pts /  2nd = 2pts / 3rd = 1pt</p>
          <p className="t">Some games give More points some give Less</p>


        </div>
      </div>
    );
  }

if (codeEntered === 1)
{  return (
    <div className="csoc">
      <h1 className="whi">Leaderboard</h1>
      <div className="fsoc">
        <div>
          <input
            className="yep"
            type="text"
            placeholder="Enter a player's name"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button className="sus_button" onClick={addPlayer}>
            Add Player
          </button>
        </div>
      </div>
      <ul>
        {sortedPlayerData &&
          sortedPlayerData.map((player) => (
            <li
              key={player.name}
              className={`player-box ${player === sortedPlayerData[0] ? "top-player" : ""} ${player === sortedPlayerData[1] ? "sec-player" : ""}`}
            >
              <p>{player.name}</p>
              <p>Score: {player.score}</p>
              <button
                className="score-button"
                onClick={() => updateScore(player.name, 1)}
              >
                +1
              </button>
              <button
                className="score-button"
                onClick={() => updateScore(player.name, -1)}
              >
                -1
              </button>
              <button
                className="remove-button"
                onClick={() => removePlayer(player.name)}
              >
                Remove
              </button>
            </li>
          ))}
      </ul>
    </div>
  );}

  if (codeEntered === 2)
  {  return (
      <div className="csoc">
        <h1 className="whi">Leaderboard</h1>
        <div className="fsoc">
          <div>
          </div>
        </div>
        <ul className="list">
          {sortedPlayerData &&
            sortedPlayerData.map((player) => (
              <li
                key={player.name}
                className={`player-box ${player === sortedPlayerData[0] ? "top-player" : ""}`}
              >
                <p>{player.name}</p>
                <p>Score: {player.score}</p>
              </li>
            ))}
        </ul>
      </div>
    );}

}

export default Leaderboard;
