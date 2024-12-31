import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import localforage from 'localforage';

import { AppTitle, Home } from './Home';
import { Setup } from './Setup';
import { PlayGame } from './PlayGame';
import { GameResult, getPreviousPlayers, getLeaderboard, getGeneralFacts } from './game-results';
import { loadGamesFromCloud, saveGameToCloud } from './tca-cloud-api';

const App = () => {

  //
  // React hooks...
  //

  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [currentPlayers, setCurrentPlayers] = useState<string[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]); 

  const [emailOnModal, setEmailOnModal] = useState("");
  const [emailForCloudApi, setEmailForCloudApi] = useState("");

  useEffect(() => {
    const loadGameResults = async () => {
      if (emailForCloudApi) {
        const savedGameResults = await loadGamesFromCloud(emailForCloudApi, "tca-root-24f");
        setGameResults(savedGameResults);
        setLeaderboardData(getLeaderboard(savedGameResults)); 
      }
    };
    loadGameResults();
  }, [emailForCloudApi]);

  useEffect(() => {
    const loadEmail = async () => {
      const savedEmail = await localforage.getItem<string>('email') ?? '';
      setEmailOnModal(savedEmail);
      setEmailForCloudApi(savedEmail);
    };
    loadEmail();
  }, []);
  

  //
  // Other funcs, helpers, calc state, etc...
  //

  const [title, setTitle] = useState(AppTitle);

  const addNewGameResult = async (newResult: GameResult) => {
    try {
      if (emailForCloudApi) {
        await saveGameToCloud(emailForCloudApi, "tca-root-24f", newResult.endTime, newResult);
        setGameResults((prev) => [...prev, newResult]);
        setLeaderboardData(getLeaderboard([...gameResults, newResult])); // Update leaderboard
      } else {
        console.error("No email set for saving to the cloud.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Hash router for all the routes
  const myRouter = createHashRouter([
    {
      path: "/",
      element: <Home 
        leaderboardData={getLeaderboard(gameResults)}
        generalFactsData={getGeneralFacts(gameResults)} 
        setTitle={setTitle}
        gameResults={
          gameResults
            .map(
              x => ({
                timestamp: x.endTime
                , winner: `${x.winner})` 
                , loser: `${x.players.find(y => y !== x.winner)})`
              })
            )
            .sort(
              (a, b) => b.timestamp.localeCompare(a.timestamp)
            )
        }
      />,
    },
    {
      path: "/setup",
      element: <Setup 
        previousPlayers={getPreviousPlayers(gameResults)}
        setCurrentPlayers={setCurrentPlayers}
      />,
    },
    {
      path: "/play",
      element: <PlayGame 
        currentPlayers={currentPlayers}
        addNewGameResult={addNewGameResult}
      />,
    },
  ]);  

  //
  // JSX...
  //

  const [darkMode, setDarkMode] = useState(false);


  return (
    <div className="App min-h-screen" data-theme={darkMode ? "dark" : "light"}>
    <header className="flex justify-between items-center px-4 py-2"></header>
  
    {/* Light/Dark mode swap */}
    <div className="absolute top-0 right-0 m-4 flex items-center space-x-2">
       {/* Signed in as text */}
       <span className="mr-1">{emailForCloudApi}</span>
       
      <label className="swap swap-rotate">
        {/* This hidden checkbox controls the state */}
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          className="theme-controller"
          value="synthwave"
        />
  
        {/* Sun icon */}
        <svg
          className="swap-on h-8 w-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        </svg>
  
        {/* Moon icon */}
        <svg
          className="swap-off h-8 w-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>
      </label>
    </div>
  
    <div className="App">
      {/* Main component handling routing */}
      <RouterProvider router={myRouter} />
    </div>
  </div>
  
  );
};

export default App;
