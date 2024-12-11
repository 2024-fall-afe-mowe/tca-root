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
  const emailModalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(
    () => {

      const loadGameResults = async () => {
        
        const savedGameResults = await loadGamesFromCloud(
          "pbrummel@gmail.com"
          , "tca-root-24f"
        );

      setGameResults(savedGameResults);
      setLeaderboardData(getLeaderboard(savedGameResults)); 
    };

    loadGameResults();
  }, []); 

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
      await saveGameToCloud("pbrummel@gmail.com", "tca-root-24f", newResult.endTime, newResult);
      setGameResults((prev) => [...prev, newResult]);
      setLeaderboardData(getLeaderboard([...gameResults, newResult]));  // Update leaderboard after new game result
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

  return (
    <div>
    <div className="App">
      {/* main component handling routing */}
      <RouterProvider router={myRouter} />
    </div>
    <dialog ref={emailModalRef} className="modal modal-bottom sm:modal-middle">
        <form method="dialog" className="modal-box">
          <h3 className="font-semibold text-lg">Enter your email</h3>
          <input
            type="email"
            className="input input-bordered w-full my-4"
            value={emailOnModal}
            onChange={(e) => setEmailOnModal(e.target.value)}
            placeholder="Enter email"
          />
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={async () => {
                await localforage.setItem<string>('email', emailOnModal);
                setEmailForCloudApi(emailOnModal);
              }}
            >
              Save
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default App;
