import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import * as CONST from "./globals"; // Add Const. before the constant you using
import {IUserInformation} from "./types"

import './App.css';

const App = () => {
  /* UseStae Declaration */
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<IUserInformation | null>(null);

  /* Logout the user and delete */
  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const fetchUserInfomation = async () => {
    try {
      const res = await fetch(`https://api.spotify.com/v1/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const json = await res.json();
      console.log(json);
      setUser(json);
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  }

  const createPlaylist = async (user_id: string) => {
    try {
      const data = {
        "name": "New Playlist",
        "description": "New playlist description",
        "public": false
      };
      const res = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      console.log(json);
    } catch (error) {
      console.error("Error creating a playlist:", error);
    }
  }

  const getToken = () => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      console.log(hash);
      if (hash) {
        const tokenParam = hash
          .substring(1)
          .split("&")
          .find(elem => elem.startsWith("access_token="));
        console.log(tokenParam);

        if (tokenParam) {
          const tokenParts = tokenParam.split("=");
          if (tokenParts.length === 2) {
            token = tokenParts[1];
            window.location.hash = "";
            window.localStorage.setItem("token", token);
          }
        }
      }
      window.location.hash = ""
      if (token) {
        window.localStorage.setItem("token", token);
      }
    }
    if (token) {
      setToken(token);
    }
  }

  /* UseEffect */


  useEffect(() => {
    getToken()
  }, [])

  useEffect(() => {
    if (token != "" && token) {
      fetchUserInfomation();
    }
  }, [token])

  useEffect(() => {
    if (user != null && user) {
      createPlaylist(user.id);
    }
  }, [user])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sportify React</h1>
        {!token ?
          <a href={`${CONST.AUTH_ENDPOINT}?client_id=${CONST.CLIENT_ID}&redirect_uri=${CONST.REDIRECT_URI}&response_type=${CONST.RESPONSE_TYPE}&scope=${CONST.SCOPE}`}>
            Login to Play</a>
          : <button onClick={logout}>Logout</button>}
      </header>
    </div>
  );
}

export default App;
