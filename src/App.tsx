import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import * as CONST from "./globals"; // Add Const. before the constant you using
import { BsSpotify } from 'react-icons/bs'; // Icons package
import { Circles } from 'react-loading-icons'; // Loading icon package
import { IUserInformation, ISongInformation, IPlaylist } from "./types" // Types

import './App.css';

const App = () => {
  /* UseStae Declaration */
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasPlayed, setHasPlayed] = useState<boolean>(false);

  /* Logout the user and delete */
  const logout = () => {
    window.location.href = ("http://localhost:4000")
  };

  const spotifyLogin = async () => {
    try {
      const res = await fetch('login');
      const data = await res.json()
      console.log(data)
      window.location.href = data
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /* Functions that use Sportify API */

  const Playlist = async () => {
    try {
      const res = await fetch(`playlist/?user_id=` + userId, {
        method: "GET"
      });
      const json = await res.json();
      setHasPlayed(json)
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const playClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    setIsLoading(true);
    try {
      await Playlist();
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching songs information:', error);
    }
  };
  /* UseEffect */

  /* Try to get the token when the website starts */
  useEffect(() => {
    const param = window.location.href
      .split("?")
    if (param.length >= 2) {
      const user_id = param[1].split("=")[1]
      console.log(user_id)
      setUserId(user_id)
      return
    }
    console.log("user_id is empty")
    setUserId("")
  }, [])

  /* Fetch the user information when we have the token */

  /* Helper functions */
  if (hasPlayed) {
    return (
      <div className="App">
        <header className="App-header">
          {!isLoading ? (<h1> Spotify Arcade <BsSpotify /></h1>)
            : <h1> Generating</h1>
          }

          {!isLoading ? (<div className="Button">
            {userId ?
              <button onClick={logout}>Logout</button>
              : <button onClick={spotifyLogin}>Login To Start</button>}
            {userId ?
              <button onClick={playClick}>Play again</button>
              : <></>}
            <p className="description">Playlist has been created!</p>
          </div>) : (<Circles />)}
        </header>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        {!isLoading ? (<h1> Spotify Arcade <BsSpotify /></h1>)
          : <h1> Generating</h1>
        }

        {!isLoading ? (<div className="Button">
          {userId ?
            <button onClick={logout}>Logout</button>
            : <button onClick={spotifyLogin}>Login To Start</button>}
          {userId ?
            <button onClick={playClick}>Let's Play</button>
            : <></>}
          <p className="description">Create a Spotify playlist based on cute photos of cats!</p>
        </div>) : (<Circles />)}
      </header>
    </div>
  )



  // <div className="App">
  //   <header className="App-header">
  //     <h1>Spotify React</h1>
  //     {!token ?
  //       <a href={`${CONST.AUTH_ENDPOINT}?client_id=${CONST.CLIENT_ID}&redirect_uri=${CONST.REDIRECT_URI}&response_type=${CONST.RESPONSE_TYPE}&scope=${CONST.SCOPE}`}>
  //         Login to Play</a>
  //       : <button onClick={logout}>Logout</button>}
  //   </header>
  // </div>
}

export default App;
