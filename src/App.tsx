import React, { useEffect, useState } from 'react';
import './App.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';

import { Home } from './Home';
import { Setup } from './Setup';
import { PlayGame } from './PlayGame';
import { GameResult, getPreviousPlayers } from './game-results';
import { loadGamesFromCloud, saveGameToCloud } from './tca-cloud-api';

const App = () => {

  //
  // React hooks...
  //

  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [currentPlayers, setCurrentPlayers] = useState<string[]>([]);

  useEffect(
    () => {

      const loadGameResults = async () => {
        
        const savedGameResults = await loadGamesFromCloud(
          "pbrummel@gmail.com"
          , "tca-root-24f"
        );

        if (!ignore) {
          setGameResults(savedGameResults);
        }
      }

      let ignore = false;
      loadGameResults();
      
      return () => {
        ignore = true;
      }
    }
    , []
  ); 

  //
  // Other funcs, helpers, calc state, etc...
  //

  const addNewGameResult = async (newResult: GameResult) => {

    try {
        await saveGameToCloud(
          "pbrummel@gmail.com"
          , "tca-root-24f"
          , newResult.endTime
          , newResult
        );

      // Optimistically updates the lifted state... Okay-ish, it's never failed for me : - )
      setGameResults([
        ...gameResults 
        , newResult
      ]);
    }
    catch (e) {
      console.error(e);
    }
  };

  // Hash router for all the routes
  const myRouter = createHashRouter([
    {
      path: "/",
      element: <Home />,
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
    <div className="App">
      {/* main component handling routing */}
      <RouterProvider router={myRouter} />
    </div>
  );
}

export default App;
