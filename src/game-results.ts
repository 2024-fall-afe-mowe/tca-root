import { durationFormatter } from 'human-readable';

const formatGameDuration = durationFormatter<string>();

const formatLastPlayed = durationFormatter<string>({
    allowMultiples: ["y", "mo", "d"]
});


export type GameResult = {
    startTime: string;
    endTime: string;
    winner: string;
    players: string[];
    faction: string; 
};

export const getPreviousPlayers = (results: GameResult[]) => {
    
    const previousPlayers = results.flatMap(
        x => x.players
    );

    return(
        [
            ...new Set(previousPlayers)
        ].sort(
            (a, b) => a.localeCompare(b)
        )
    );
};

export type LeaderboardEntry = {
    wins: number;
    losses: number;
    avg: string;
    name: string;  
};

export type GeneralFactsDisplay = {
    lastPlayed: string; 
    totalGames: number; 
    shortestGame: string;
    longestGame: string;
    averageGame: string;
    winningestFaction: { name: string; count: number };
};

export const getLeaderboard = (
    results: GameResult[]
): LeaderboardEntry[] => {
  const lbEntries = getPreviousPlayers(results).map((player) =>
    getLeaderboardEntry(results, player)
  );
  //
  // Biz rule ! ! !
  //
  // Zero win players should be sorted differently...
  //
  // The more games you have without any wins make you a worse player ! ! !
  //
  // So filter and sort two lb entry arrays differently, i-o-g : - )
  //
  const playersWithWins = lbEntries
    .filter((x) => x.wins > 0)
    .sort(
      (a, b) =>
        (parseFloat(b.avg) * 1000 + b.wins + b.losses) 
            - (parseFloat(a.avg) * 1000 + a.wins + a.losses)
    );

  const playersWithoutWins = lbEntries
    .filter((x) => x.wins === 0)
    .sort(
      (a, b) => a.losses - b.losses
    );

    return [
        ...playersWithWins
        , ...playersWithoutWins
    ];
};

//
// Helper funcs...
//
const getLeaderboardEntry = (
    results: GameResult[]
    , player: string
): LeaderboardEntry => {

    const playerWins = results.filter(
        x => x.winner === player
    ).length;

    const playerGames = results.filter(
        x => x.players.some(
            y => y === player
        )
    ).length;

    return {
        wins: playerWins
        , losses: playerGames - playerWins 

        , avg: playerGames > 0
            ? (playerWins / playerGames).toFixed(3)
            : "0.000"

        , name: player
    };
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

// Valid factions
const validFactions = ["Marquise de Cat", "Eyrie Dynasties", "Woodland Alliance", "Vagabond"];

// Calculate the winningest faction
const factionWins = results.reduce<Record<string, number>>((acc, game) => {
    if (validFactions.includes(game.faction)) {
        acc[game.faction] = (acc[game.faction] || 0) + 1;
    }
    return acc;
}, {});

const sortedFactions = Object.entries(factionWins).sort(
    (a, b) => b[1] - a[1]
);

const winningFaction = sortedFactions.length > 0 ? sortedFactions[0][0] : "None";
const winningCount = sortedFactions.length > 0 ? sortedFactions[0][1] : 0;


    return {
        lastPlayed: results.length > 0
            ? `${formatLastPlayed(lastPlayedInMilliseconds)} ago`
            : 'n/a'
        , totalGames: results.length
        , shortestGame: results.length > 0
            ? formatGameDuration(shortestGameInMilliseconds)
            : 'n/a'
        , longestGame: results.length > 0
            ? formatGameDuration(longestGameInMilliseconds)
            : 'n/a'
        , averageGame: results.length > 0
            ? formatGameDuration(
                gameDurationsInMilliseconds.reduce(
                    (acc, x) => acc + x
                    , 0
                ) / results.length
            )
            : 'n/a',
        winningestFaction: { name: winningFaction, count: winningCount },
    };
};
  