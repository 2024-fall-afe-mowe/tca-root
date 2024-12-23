import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png";
import { LeaderboardEntry } from "./game-results";
import React, { useRef } from "react";
import localforage from "localforage";

export const AppTitle = "Root Companion App";

// Define the structure of a "player" object
export interface Player {
  name: string;
  wins: number;
  losses: number;
  pct: string;
}

interface GeneralFactsDisplay {
  totalGames: number;
  lastPlayed: string;
  shortestGame: string;
  longestGame: string;
  averageGame: string;
  winningestFaction: { name: string; count: number };
  highestVPAchieved: number;
  highestVPAchievedPlayer: string;
  highestVPAchievedFaction: string;
}

interface HomeProps {
  leaderboardData: LeaderboardEntry[];
  gameResults: { timestamp: string; winner: string; loser: string }[];
  generalFactsData: GeneralFactsDisplay;
  setTitle: (t: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  leaderboardData,
  generalFactsData,
  setTitle,
}) => {
  const emailModalRef = useRef<HTMLDialogElement | null>(null);

  const openEmailModal = () => {
    emailModalRef.current?.showModal();
  };

  const [emailForCloudApi, setEmailForCloudApi] = useState<string | null>(null);
  const [emailOnModal, setEmailOnModal] = useState<string>("");

  useEffect(() => {
    setTitle(AppTitle);

    // Load email from localforage on component mount
    const loadEmail = async () => {
      const savedEmail = await localforage.getItem<string>("email");
      setEmailForCloudApi(savedEmail || null);
    };

    loadEmail();
  }, [setTitle]);

  const [players, setPlayers] = useState<Player[]>([]);

  return (
    <div>
      <br />
      <br />

      {/* Navbar with Centered Logo */}
      <nav className="navbar bg-base-100 justify-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-12" />
        </Link>
      </nav>

      <h2 className="text-2xl luminari-font">a companion app by TSA Games</h2>
      <br />
      <div className="flex items-center space-x-2 justify-center">
          <span className="text-sm baskerville">
            Currently logged in as: <span className= "font-semibold">{emailForCloudApi || "Guest"}</span>
          </span>
          <button className="btn btn-sm btn-primary font-bold text-white" onClick={openEmailModal}>
            Switch
          </button>
        </div>
      <br />
      {/* Email Modal */}
      <dialog
        ref={emailModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box relative">
             {/* Close Button */}
              <button
                type="button"
                className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
                onClick={() => emailModalRef.current?.close()}
              >
                ✕
              </button>

          <h3 className="font-semibold text-lg">Enter your email</h3>
          <input
            type="email"
            className="input input-bordered w-full my-4"
            value={emailOnModal}
            onChange={(e) => setEmailOnModal(e.target.value)}
            placeholder="Enter email"
          />
          (You will need to refresh after saving to view new user info)
          <div className="modal-action">
            <button
              className="btn btn-primary text-white"
              onClick={async () => {
                await localforage.setItem("email", emailOnModal);
                setEmailForCloudApi(emailOnModal);
              }}
            >
              Save
            </button>
          </div>
        </form>
      </dialog>

      <Link to="/setup" className="btn btn-secondary font-bold arial">
        Go to Setup
      </Link>
      <br />
      <br />

      {/* Leaderboard Section */}
      <h1 className="text-2xl font-bold luminari-font">Leaderboard</h1>
      <div className="card bg-base-100 shadow-xl baskerville">
        <div className="card-body">
          {leaderboardData.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              <div className="text-left font-bold">Player</div>
              <div className="text-center font-bold">W</div>
              <div className="text-center font-bold">L</div>
              <div className="text-center font-bold">Pct</div>
            </div>
          ) : (
            <p className="text-center">
              (Please add new players to view Leaderboard)
            </p>
          )}

          {leaderboardData.map((player, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 mt-2 border-b border-gray-300 pb-2"
            >
              <div className="text-left">{player.name}</div>
              <div className="text-center">{player.wins}</div>
              <div className="text-center">{player.losses}</div>
              <div className="text-center">{player.avg}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10"></div>

      {/* General Stats Section */}
      <h1 className="text-2xl font-bold luminari-font">Fun Fact Stats</h1>
      <div className="card bg-base-100 shadow-xl mb-3 baskerville">
        <div className="card-body p-3 overflow-x-hidden">
          <table className="table">
            <tbody>
              <tr>
                <td>Total Games</td>
                <th>{generalFactsData.totalGames}</th>
              </tr>
              <tr>
                <td>Last Played</td>
                <th>{generalFactsData.lastPlayed}</th>
              </tr>
              <tr>
                <td>Shortest Game</td>
                <th>{generalFactsData.shortestGame}</th>
              </tr>
              <tr>
                <td>Longest Game</td>
                <th>{generalFactsData.longestGame}</th>
              </tr>
              <tr>
                <td>Average Game</td>
                <th>{generalFactsData.averageGame}</th>
              </tr>
              <tr>
                <td>Winningest Faction</td>
                <th>
                  {generalFactsData.winningestFaction.name} (
                  {generalFactsData.winningestFaction.count}
                  {` ${
                    generalFactsData.winningestFaction.count === 1
                      ? "win"
                      : "wins"
                  }`}
                  )
                </th>
              </tr>
              <tr>
                <td>Highest VP Achieved</td>
                <th>
                  {generalFactsData.highestVPAchieved} (
                  {generalFactsData.highestVPAchievedPlayer},{" "}
                  {generalFactsData.highestVPAchievedFaction})
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="my-10"></div>
    </div>
  );
};
