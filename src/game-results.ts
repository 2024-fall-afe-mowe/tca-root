export type GameResult = {
    startTime: string;
    endTime: string;
    winner: string;
    players: string[];
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
