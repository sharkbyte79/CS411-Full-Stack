import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import * as CONST from "./globals"; // Add Const. before the constant you using
import { BsSpotify } from 'react-icons/bs'; // Icons package
import { Circles } from 'react-loading-icons'; // Loading icon package
import { IUserInformation, ISongInformation, IPlaylist } from "./types" // Types

import './App.css';

const App = () => {
  /* UseStae Declaration */
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<IUserInformation | null>(null);
  const [songIDs, setSongIDs] = useState<string[]>(["0kdqcbwei4MDWFEX5f33yG", "44L2bY93uD65CEHWbozpx4", "5TiGe89LNDwridBLbLBGgR", "22VHOlVYBqytsrAqV8yXBK", "0ZpHuEhi1CvOJgrqOSy8mv", "60bAuEmJQfzeDV1B84H4xY"]);
  const [songs, setSongs] = useState<ISongInformation[]>([]);
  const [playlist, setPlaylist] = useState<IPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* Logout the user and delete */
  const logout = () => {
    window.location.href = ("http://localhost:4000")
  };

  const spotifyLogin = async () => {
    try {
      const res = await fetch('login');
      const data = await res.json()
      // const url = `${CONST.AUTH_ENDPOINT}?client_id=${CONST.CLIENT_ID}&redirect_uri=${CONST.REDIRECT_URI}&response_type=${CONST.RESPONSE_TYPE}&scope=${CONST.SCOPE}`;
      // window.location.href = url;
      console.log(data)
      window.location.href = data
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /* Functions that use Sportify API */

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
  };

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
      setPlaylist(json);
    } catch (error) {
      console.error("Error creating a playlist:", error);
    }
  };

  const addItems = async (playlist_id: string) => {
    let uris = [];
    for (const song of songs) {
      uris.push(song.uri);
    }

    try {
      const data = {
        "uris": uris,
        "position": 0
      };
      const res = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
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
      console.error("Error adding items:", error);
    }
  };

  async function fetchSingleSongInformation(id: string) {
    try {
      const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const json = await res.json();
      console.log(json);
      return json;
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const fetchSongsInformation = async (ids: string[]) => {
    try {
      let json = [];
      for (const id of ids) {
        const info = await fetchSingleSongInformation(id)
        json.push(info);
      }

      console.log(json);
      setSongs(json);
    } catch (error) {
      setSongs([]);
    }
  };

  const playClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    setIsLoading(true);
    try {
      await fetchSongsInformation(songIDs);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching songs information:', error);
    }
  };

  const createClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    try {
      if (user == null) {
        throw new Error("User is null")
      }
      await createPlaylist(user.id);
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
  useEffect(() => {
    if (token !== "" && token) {
      fetchUserInfomation();
    }
  }, [token])

  useEffect(() => {
    if (playlist !== null && playlist) {
      addItems(playlist.id);
    }
  }, [playlist]);

  /* Helper functions */

  /* Helper function of displayImage*/
  function chunkArray(songs: ISongInformation[], chunkSize: number) {
    const chunks = [];
    for (let i = 0; i < songs.length; i += chunkSize) {
      chunks.push(songs.slice(i, i + chunkSize));
    }
    return chunks;
  };

  /* Generate the correct html for image displayment */
  function displayImage(songs: ISongInformation[]) {
    const chunkedUrls = chunkArray(songs, 3);

    return (
      <div className="container">
        {chunkedUrls.map((group, index) => (
          <div key={index} className="group">
            {group.map((song, i) => (
              <div key={i} className="songContainer">
                <a href={song.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  <img src={song.album.images[1].url} alt={`Image ${i + 1}`} style={{ marginRight: i !== group.length - 1 ? '50px' : '0', cursor: 'pointer' }} />
                </a>
                <div className="songName">{song.name}</div>
                <div className="artistName">{song.artists[0].name}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  if (songs.length === 0) {
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
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1> About </h1>
        {displayImage(songs)}
        <button onClick={createClick}>Create Playlist</button>
      </header>
    </div>



    // <div className="App">
    //   <header className="App-header">
    //     <h1>Spotify React</h1>
    //     {!token ?
    //       <a href={`${CONST.AUTH_ENDPOINT}?client_id=${CONST.CLIENT_ID}&redirect_uri=${CONST.REDIRECT_URI}&response_type=${CONST.RESPONSE_TYPE}&scope=${CONST.SCOPE}`}>
    //         Login to Play</a>
    //       : <button onClick={logout}>Logout</button>}
    //   </header>
    // </div>
  );
}

export default App;
