import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { GameResult } from './game-results';

// Define or import the Player type
export interface Player {
  name: string;
  wins: number;
  losses: number;
  average: number;
}

const API_URL = "https://32wop75hhc.execute-api.us-east-1.amazonaws.com/prod/data";

export const saveGameToCloud = async (
  email: string,
  appName: string,
  timestamp: string,
  gameResult: GameResult
) => {
  if (!email || !gameResult) {
    console.error("Email and valid game result are required to save game data.");
    return;
  }

  const dynamoGame = {
    pk: email.toLowerCase(),
    sk: `${appName}#${timestamp}`,
    ts: timestamp,
    user: email.toLowerCase(),
    app: appName,
    gsi1pk: appName,
    gsi1sk: timestamp,
    game: gameResult,
  };

  console.log("Unmarshalled Game:", dynamoGame);

  try {
    const marshalledGame = marshall(dynamoGame, {
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    });

    console.log("Marshalled Game:", marshalledGame);

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        TableName: "tca-data",
        Item: marshalledGame,
      }),
    };

    const response = await fetch(API_URL, options);
    if (!response.ok) {
      console.error("Failed to save game:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error saving game to cloud:", error);
  }
};

export const loadGamesFromCloud = async (email: string, appName: string) => {
  if (!email) {
    console.error("Email is required to load game data.");
    return [];
  }

  const url = `${API_URL}/?user=${email.toLowerCase()}&game=${appName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to load games:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data.Items || !Array.isArray(data.Items)) {
      console.warn("Unexpected response format:", data);
      return [];
    }

    const games = data.Items.map((item: any) => {
      const unmarshalled = unmarshall(item);
      return unmarshalled.game || null; // Ensure `.game` exists
    }).filter(Boolean); // Filter out null or invalid games

    return games;
  } catch (error) {
    console.error("Error loading games from cloud:", error);
    return [];
  }
};

export const addPlayerToCloud = async (player: Player) => {
  try {
    const response = await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });
    if (!response.ok) {
      console.error("Failed to add player:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error adding player:", error);
  }
};

export const deletePlayerFromCloud = async (name: string) => {
  try {
    const response = await fetch(`${API_URL}/players/${name}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.error("Failed to delete player:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error deleting player:", error);
  }
};
