import { durationFormatter } from 'human-readable';

const formatGameDuration = durationFormatter<string>();

const formatLastPlayed = durationFormatter<string>({
    allowMultiples: ["y", "mo", "d"]
});

//
// Type definitions...
//
export type Turn = {
    turnNumber: number;
    player: string;
};

export type GameResult = {
    startTime: string;
    endTime: string;

    winner: string;
    winningFaction: Faction;
    losingFaction: Faction;
    players: string[];

    turns: Turn[];
};

export type LeaderboardEntry = {
    wins: number;
    losses: number;
    avg: string;
    name: string;  
};

export type Faction = undefined | "Marquise de Cat" | "Eyrie Dynasty" | "Woodland Alliance" | "Vagabond";

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
            : 'n/a'
    };
};

export const getFactionLeaderboard = (results: GameResult[]) => {

    //
    // Transform the game results so that...
    //
    // . winner = winningFaction, and
    // . players array are the factions that played
    //
    const trickyTransformedResults = results.map(
        x => ({
            ...x 
            , winner: x.winningFaction ?? ""
            , players: [
                x.winningFaction?.toString() ?? ""
                , x.losingFaction?.toString() ?? ""
            ]
        })
    );

    // Then hopefully we can just call the existing getLeaderboard and 
    // have a faction leadeboard ! ! ! i-o-g
    return getLeaderboard(trickyTransformedResults);
};


export const getMonthBasedGamesDistribution = (results: GameResult[]) => {

    return (
        ([
            ['Jan', 0]
            , ['Feb', 1]
            , ['Mar', 2]
            , ['Apr', 3]
            , ['May', 4]
            , ['Jun', 5]
            , ['Jul', 6]
            , ['Aug', 7]
            , ['Sep', 8]
            , ['Oct', 9]
            , ['Nov', 10]
            , ['Dec', 11]
        ] as [string, number][]).map(x => ({
            month: x[0]
            , gameCount: results.filter(
                y => new Date(y.startTime).getMonth() === x[1]
            ).length
        }))
    );
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

const getAvgTurnsPerGame = (results: GameResult[]) => {

    // Current dummyGameResults has...
    // . 2 games 
    // . 1 game has 3 turns 
    // . 1 game has 2 turns 
    // . expect avg to be (3 + 2) / 2 = 2.5

    // Get max turn number for each game, and use as number of turns in the game.
    const arrayOfMaxTurnNumbers = results.map(
        x => Math.max(...x.turns.map(
                y => y.turnNumber
            )
        )
    );

    // console.log(arrayOfMaxTurnNumbers); // Expect [3, 2]

    return (
        arrayOfMaxTurnNumbers.length > 0
            ? arrayOfMaxTurnNumbers.reduce(
                (acc, x) => acc + x
                , 0
            ) / arrayOfMaxTurnNumbers.length
            : 0
    );
};
