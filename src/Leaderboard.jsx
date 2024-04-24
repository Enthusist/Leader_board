import React, { useState, useEffect } from "react";
import "./Leaderboard.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import crown from './assets/crown.png';
// import { useDrag } from 'react-dnd'
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import StorageList from "./storage_list";

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

// Create a root reference



// uploadBytes(storageRef, file).then((snapshot) => {
//   console.log('Uploaded a blob or file!');
//   getDownloadURL(storageRef.snapshot.ref).then((downloadURL) => {
//     console.log('File available at', downloadURL);
//   });
// });

function Leaderboard() {
  const [inputValue, setInputValue] = useState("");
  const [inputValuec, setInputValuec] = useState("");
  const [SelectedFile, SetSelectedFile] = useState(null);
  const [codeEntered, setCodeEntered] = useState(0);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputChangec = (e) => {
    setInputValuec(e.target.value);
  };

  const addPlayer = async () => {

if (sortedPlayerData.length <15)    {    if (inputValue.trim() !== "") {
      await firestore.collection("players").add({
        name: inputValue,
        score: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setInputValue("");
    }}
  };



// On file select (from the pop up)
const onFileChange = (event) => {
    // Update the state
SetSelectedFile(event.target.files[0]);
};

// On file upload (click the upload button)
// const onFileUpload = () => {
//     // Create an object of formData
//     const formData = new FormData();

//     // Update the formData object
//     formData.append(
//         "myFile",
//         SelectedFile,
//         SelectedFile.name
//     );

//     // Details of the uploaded file
//     console.log(SelectedFile);

//     // Request made to the backend api
//     // Send formData object
//     axios.post("api/uploadfile", formData);
// };

const onFileUpload = () => {
  if (SelectedFile) {

    const storage = getStorage();

    const storageRef = ref(storage, 'your-folder/' + SelectedFile.name); // Replace 'your-folder' with your desired folder in Firebase Storage

      uploadBytes(storageRef, SelectedFile).then((snapshot) => {
          console.log('Uploaded a blob or file!');
          getDownloadURL(snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              // Handle the download URL, you can save it in state or wherever you need
          }).catch((error) => {
              // Handle any errors
              console.error('Error getting download URL:', error);
          });
      }).catch((error) => {
          // Handle any errors
          console.error('Error uploading file:', error);
      });
  } else {
      console.log('No file selected!');
  }
};



const fileData = () => {
  if (SelectedFile) {
    return (
      <div>
        <h2>File Details:</h2>
        <p>Name: {SelectedFile.name}</p>
        <p>Type: {SelectedFile.type}</p>
        <p>Last Modified: {SelectedFile.lastModifiedDate.toDateString()}</p>
      </div>
    );
  } else {
    return (
      <div>
        <h2>File Details:</h2>
        <p>Choose a file before pressing the Upload button</p>
      </div>
    );
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
    if (inputValuec.trim() === "fmsbreak") {
      setCodeEntered(2);
    }
    if (inputValuec.trim() === "amogus") {
      setCodeEntered(1);
    }

  };



   if (codeEntered === 0) {
    return (
      <div className="csoc">
        <h1 className="whi">GAME START</h1>
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
    <div className="cosoc">
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
      <div className="cosoc">
        <h1 className="whi">Leaderboard</h1>
        <ul className="list">
          {sortedPlayerData &&
            sortedPlayerData.map((player) => (
              <li
                key={player.name}
                className={`player-box ${player === sortedPlayerData[0] ? "top-player" : ""}`}
              >
                <p># {player.name}</p>
                {player === sortedPlayerData[0] ? (<img className="jol" src={crown} alt="Crown" />) : (null)}
                <p>Score: {player.score}</p>
              </li>
            ))}
        </ul>
        <div>
          <div>
                    <input
                        type="file"
                        onChange={onFileChange}
                    />
                    <button onClick={onFileUpload}>
                        Upload!
                    </button>
                </div>
                {fileData()}
            </div>
           

                <StorageList />
      </div>
    );} 

}

export default Leaderboard;
