import { durationFormatter } from 'human-readable';

// Create duration formatters
const formatGameDuration = durationFormatter<string>();

const formatLastPlayed = durationFormatter<string>({
  allowMultiples: ["y", "mo", "d"]
});

// Function to process the results
const processResults = (results: GameResult[], selectedFactions: { playerName: string, faction: string }[]) => {
  return results.map(result => ({
    winner: result.winner,
    players: result.players.map(player => {
      const factionData = selectedFactions.find(p => p.playerName === player.name);
      return {
        name: player.name,
        faction: factionData ? factionData.faction : "Unknown",
        result: player.name === result.winner ? "Win" : "Loss"
      };
    }),
    startTime: result.startTime,
    endTime: result.endTime,
    winningFaction: result.winningFaction,
    losingFaction: result.losingFaction,
    date: result.date
  }));
};

// Example usage:
const selectedFactions = [
  { playerName: "Alice", faction: "Marquise de Cat" },
  { playerName: "Bob", faction: "Eyrie Dynasties" }
];

// Assuming results is defined somewhere
const results: GameResult[] = []; // This should be populated with actual results
const processedResults = processResults(results, selectedFactions);

// Custom declaration if no @types/human-readable exists
declare module 'human-readable' {
  export function durationFormatter<T = string>(
    options?: Record<string, unknown>
  ): (milliseconds: number) => T;
}

//
// Type definitions...
//
export type GameResult = {
  startTime: string;
  endTime: string;
  winningFaction: Faction;
  losingFaction: Faction;
  players: {
    name: string;
    faction: string;
    result: "Win" | "Loss";
  }[];
  winner: string;
  date: string;
};

export type LeaderboardEntry = {
  wins: number;
  losses: number;
  avg: string;
  name: string;
};

export type Faction = undefined | "Marquise" | "Eyrie" | "Woodland" | "Vagabond";

export type CurrentPlayer = {
  name: string;
  faction: Faction;
};

export type GeneralFactsDisplay = {
  lastPlayed: string;
  totalGames: number;
  shortestGame: string;
  longestGame: string;
  averageGame: string;
};

//
// Exported funcs...
//
export const getLeaderboard = (results: GameResult[]): LeaderboardEntry[] => {
  const lbEntries = getPreviousPlayers(results).map(playerName =>
    getLeaderboardEntry(results, playerName) // Use playerName here, not player.name
  );

  // Zero win players should be sorted differently...
  const playersWithWins = lbEntries
    .filter(x => x.wins > 0)
    .sort(
      (a, b) =>
        (parseFloat(b.avg) * 1000 + b.wins + b.losses) -
        (parseFloat(a.avg) * 1000 + a.wins + a.losses)
    );

  const playersWithoutWins = lbEntries
    .filter(x => x.wins === 0)
    .sort((a, b) => a.losses - b.losses);

  return [...playersWithWins, ...playersWithoutWins];
};

export const getPreviousPlayers = (results: GameResult[]) => {
  const previousPlayers = results.flatMap(x => x.players.map(p => p.name));
  return Array.from(new Set(previousPlayers)).sort((a, b) => a.localeCompare(b));
};

export const getGeneralFacts = (results: GameResult[]): GeneralFactsDisplay => {
  const now = Date.now();
  const gameEndTimesInMilliseconds = results.map(x => Date.parse(x.endTime));
  const lastPlayedInMilliseconds = now - Math.max(...gameEndTimesInMilliseconds);

  const gameDurationsInMilliseconds = results.map(
    x => Date.parse(x.endTime) - Date.parse(x.startTime)
  );

  const shortestGameInMilliseconds = Math.min(...gameDurationsInMilliseconds);
  const longestGameInMilliseconds = Math.max(...gameDurationsInMilliseconds);

  return {
    lastPlayed: results.length > 0
      ? `${formatLastPlayed(lastPlayedInMilliseconds)} ago`
      : 'n/a',
    totalGames: results.length,
    shortestGame: results.length > 0
      ? formatGameDuration(shortestGameInMilliseconds)
      : 'n/a',
    longestGame: results.length > 0
      ? formatGameDuration(longestGameInMilliseconds)
      : 'n/a',
    averageGame: results.length > 0
      ? formatGameDuration(
          gameDurationsInMilliseconds.reduce((acc, x) => acc + x, 0) / results.length
        )
      : 'n/a'
  };
};

export const getFactionLeaderboard = (results: GameResult[]) => {
  // Transform the game results
  return results.map(result => ({
    winner: result.winner,
    players: result.players.map(player => {
      const factionData = selectedFactions.find(p => p.playerName === player.name);
      return {
        name: player.name,
        faction: factionData ? factionData.faction : "Unknown",
        result: player.name === result.winner ? "Win" : "Loss"
      };
    }),
    startTime: result.startTime,
    endTime: result.endTime,
    winningFaction: result.winningFaction,
    losingFaction: result.losingFaction,
    date: result.date
  }));
};

export const getMonthBasedGamesDistribution = (results: GameResult[]) => {
  return ([ 
    ['Jan', 0],
    ['Feb', 1],
    ['Mar', 2],
    ['Apr', 3],
    ['May', 4],
    ['Jun', 5],
    ['Jul', 6],
    ['Aug', 7],
    ['Sep', 8],
    ['Oct', 9],
    ['Nov', 10],
    ['Dec', 11]
  ] as [string, number][]).map(x => ({
    month: x[0],
    gameCount: results.filter(
      y => new Date(y.startTime).getMonth() === x[1]
    ).length
  }));
};

//
// Helper funcs...
//
const getLeaderboardEntry = (results: GameResult[], player: string): LeaderboardEntry => {
  const playerWins = results.filter(x => x.winner === player).length;
  const playerGames = results.filter(x =>
    x.players.some(y => y.name === player)
  ).length;

  return {
    wins: playerWins,
    losses: playerGames - playerWins,
    avg: playerGames > 0 ? (playerWins / playerGames).toFixed(3) : "0.000",
    name: player
  };
};
