import React, { useEffect, useState } from 'react';
import './App.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';

import { AppTitle, Home } from './Home';
import { Setup } from './Setup';
import { PlayGame } from './PlayGame';
import { GameResult, getPreviousPlayers, getLeaderboard } from './game-results';
import { loadGamesFromCloud, saveGameToCloud } from './tca-cloud-api';

const App = () => {

  //
  // React hooks...
  //

  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [currentPlayers, setCurrentPlayers] = useState<string[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]); 

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
    <div className="App">
      {/* main component handling routing */}
      <RouterProvider router={myRouter} />
    </div>
  );
}

export default App;
