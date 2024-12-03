import React from 'react';
import './App.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';

import { Home } from './Home';
import { Setup } from './Setup';
import { PlayGame } from './PlayGame';

import localforage from 'localforage';

import { saveGameToCloud } from './tca-cloud-api';

// Hash router for all the routes
const myRouter = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/setup",
    element: <Setup />,
  },
  {
    path: "/play",
    element: <PlayGame />,
  },
]);

const App = () => {
  return (
    <div className="App">
      {/* main component handling routing */}
      <RouterProvider router={myRouter} />
    </div>
  );
}

export default App;
