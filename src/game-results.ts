// Define the structure of a "player" object
export interface Player {
  name: string;
  wins: number;
  losses: number;
  pct: string;
};

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