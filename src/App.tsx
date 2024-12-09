import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';

import { AppTitle, Home } from './Home';
import { Setup } from './Setup';
import { PlayGame } from './PlayGame';

import { 
  CurrentPlayer
  , GameResult 
  , getLeaderboard
  , getPreviousPlayers
  , getGeneralFacts
  , getFactionLeaderboard
  , getMonthBasedGamesDistribution
} from "./game-results";

import localforage from 'localforage';

import { 
  saveGameToCloud
  , loadGamesFromCloud 
} from './tca-cloud-api';


const App = () => {

  
  //
  // React hooks first...
  //
  const [gameResults, setGameResults] = useState<GameResult[]>([]);

  const [currentPlayers, setCurrentPlayers] = useState<CurrentPlayer[]>([]);
  //
  // Other code... Calculated state...
  //
  const addNewGameResult = async (newResult: GameResult) => {

    try {

      if (emailForCloudApi.length > 0) {
        await saveGameToCloud(
          emailForCloudApi  // User's cloud account
          , "tca-root-24f" // Specific key for the game results . . . can this be called anything I want it to be?? 
          , newResult.endTime // Timestamp for when the game ended
          , newResult // The new game result to save
        );
      }

      // Optimistically updates the lifted state... Okay-ish, it's never failed for me : - )
      setGameResults([
        ...gameResults  // existing game results
        , newResult // The new game result being added
      ]);
    }
    catch (e) {
      console.error(e);
    }
  };

  const [title, setTitle] = useState(AppTitle);

  const emailModalRef = useRef<HTMLDialogElement | null>(null);

  const [emailOnModal, setEmailOnModal] = useState("");
  
  const [emailForCloudApi, setEmailForCloudApi] = useState("");
  

  useEffect(
    () => {

      const loadEmail = async () => {
        
        const savedEmail = await localforage.getItem<string>("email") ?? "";

        if (!ignore) {
          setEmailOnModal(savedEmail);
          setEmailForCloudApi(savedEmail);
        }
      }

      let ignore = false;

      loadEmail();
      
      return () => {
        ignore = true;
      }
    }
    , []
  );  
    
  useEffect(
    () => {

      const loadGameResults = async () => {
        
        const savedGameResults = await loadGamesFromCloud(
          emailForCloudApi
          , "tca-root-24f"
        );

        if (!ignore) {
          setGameResults(savedGameResults);
        }
      }

      let ignore = false;

      if (emailForCloudApi.length > 0) {
        loadGameResults();
      }
      
      return () => {
        ignore = true;
      }
    }
    , [emailForCloudApi]
  );  

  // Hash router for all the routes
  const myRouter = createHashRouter(
    [
      {
        path: "/",
        element: <Home
          leaderboardData={getLeaderboard(gameResults)}
          generalFactsData={getGeneralFacts(gameResults)} 
          setTitle={setTitle}
          factionLeaderboardData={getFactionLeaderboard(gameResults)}
          gameResults={
            gameResults
              .map(
                x => ({
                  timestamp: x.endTime
                  , winner: `${x.winner} (${x.winningFaction})` 
                  , loser: `${x.players.find(y => y !== x.winner)} (${x.losingFaction})`
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
          setTitle={setTitle}
        />,
      },
      {
        path: "/play",
        element: <PlayGame 
          addNewGameResult={addNewGameResult}
          currentPlayers={currentPlayers}
          setTitle={setTitle}
        />,
      },
    ]
  );


  //
  // Return the JSX...
  //
  return (
    <div className="App">
      {/* main component handling routing */}
      <RouterProvider router={myRouter} />
        <dialog
          ref={emailModalRef}
          className="modal modal-bottom sm:modal-middle"
        >
          <div 
            className="modal-box"
          >
            <h3 
              className="font-semibold text-md"
            >
              Enter email to load/save game results...
            </h3>
            <p 
              className="py-4"
            >
              <input 
                  className="input input-bordered w-full" 
                  placeholder="Enter email"
                  value={emailOnModal} 
                  onChange={(e) => setEmailOnModal(e.target.value)}
              />
            </p>
            <div 
              className="modal-action"
            >
              <form 
                method="dialog"
              >
                {/* if there is a button, it will close the modal */}
                <button 
                  className="btn btn-outline"
                  onClick={
                    async () => {
                      const savedEmail = await localforage.setItem<string>("email", emailOnModal);

                      if (savedEmail.length > 0) {
                        setEmailForCloudApi(savedEmail);
                      }
                    }
                  }
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </dialog>
</div>
  );
}

export default App;
