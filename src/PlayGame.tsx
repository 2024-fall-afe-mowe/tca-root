import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PlayGame = () => {

    const nav = useNavigate();

    // States to store the initial dice rolls and final hits
    const [initialDice1, setInitialDice1] = useState(0);
    const [initialDice2, setInitialDice2] = useState(0);
    const [attacker, setAttacker] = useState('');
    const [defender, setDefender] = useState('');
    const [attackerHits, setAttackerHits] = useState<null | number>(null); // Store hits for attacker
    const [defenderHits, setDefenderHits] = useState<null | number>(null); // Store hits for defender

  // States for tracking victory points for each faction
  const [marquisePoints, setMarquisePoints] = useState(0);
  const [eyriePoints, setEyriePoints] = useState(0);
  const [woodlandPoints, setWoodlandPoints] = useState(0);
  const [vagabondPoints, setVagabondPoints] = useState(0);

  // Function to handle increment and decrement of victory points for each faction
  const incrementPoints = (setPoints: React.Dispatch<React.SetStateAction<number>>, points: number) =>
    setPoints(points + 1);
  const decrementPoints = (setPoints: React.Dispatch<React.SetStateAction<number>>, points: number) =>
    setPoints(points > 0 ? points - 1 : 0);

    // Function to generate random numbers between 0 and 3 for each dice
    const rollDice = () => {
      let newDice1 = Math.floor(Math.random() * 4); // Random number between 0 and 3
      let newDice2 = Math.floor(Math.random() * 4); // Random number between 0 and 3

    // Save initial rolls before any swapping
    setInitialDice1(newDice1);
    setInitialDice2(newDice2);

    // Check if the defender is Woodland Alliance; if so, they get the higher roll
    if (defender === 'Woodland Alliance') {
      if (newDice1 > newDice2) {
        [newDice1, newDice2] = [newDice2, newDice1]; // Swap so Woodland Alliance (defender) gets higher roll
      }
      } else {
        // Otherwise, ensure the attacker gets the higher roll
        if (newDice2 > newDice1) {
          [newDice1, newDice2] = [newDice2, newDice1]; // Swap dice values so attacker gets higher roll
        }
      }

      // Set the number of hits for each faction
      setAttackerHits(newDice1); // Attacker gets the higher roll
      setDefenderHits(newDice2); // Defender gets the lower roll
    };


   // Function to get the color based on the faction name
   const getFactionColor = (faction: string): string => {
    switch (faction) {
      case 'Marquise de Cat':
        return 'orange';
      case 'Eyrie Dynasties':
        return 'royalblue';
      case 'Woodland Alliance':
        return '#4CAF50'; 
      case 'Vagabond':
        return 'gray';
      default:
        return 'black'; // Default color if no faction is selected
    }
  };

  return (
    <div className="App">
      <h1 className="text-2xl font-bold mb-3 mt-3">Play Game</h1>

      {/* Dice Roller Simulator */}
      <div className="card bg-base-100 shadow-xl card-bordered my-6 p-3">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Battle Roller</h2>

      {/* Attacker and Defender Labels */}
      <div className="dice-label-container">
        <div className="dice-label-left">
          <p className="label">Attacker</p>
        </div>
        <div className="dice-label-right">
          <p className="label">Defender</p>
        </div>
      </div>

      {/* Dice Display: initial rolls */}
      <div className="dice-container">
        <div className="dice">
          <p className="dice-value">{initialDice1}</p> {/* Show initial roll for dice1 */}
        </div>
        <div className="dice">
          <p className="dice-value">{initialDice2}</p> {/* Show initial roll for dice2 */}
        </div>
      </div>

      {/* Faction Dropdowns */}
      <div className="dropdown-container">
        <div className="dropdown-left">
          <label htmlFor="attacker">Select Attacker Faction:</label>
          <select
            id="attacker"
            value={attacker}
            onChange={(e) => setAttacker(e.target.value)}
            className="faction-select"
          >
            <option value="">-- Select Faction --</option>
            <option value="Marquise de Cat">Marquise de Cat</option>
            <option value="Eyrie Dynasties">Eyrie Dynasties</option>
            <option value="Woodland Alliance">Woodland Alliance</option>
            <option value="Vagabond">Vagabond</option>
          </select>
        </div>

        <div className="dropdown-right">
          <label htmlFor="defender">Select Defender Faction:</label>
          <select
            id="defender"
            value={defender}
            onChange={(e) => setDefender(e.target.value)}
            className="faction-select"
          >
            <option value="">-- Select Faction --</option>
            <option value="Marquise de Cat">Marquise de Cat</option>
            <option value="Eyrie Dynasties">Eyrie Dynasties</option>
            <option value="Woodland Alliance">Woodland Alliance</option>
            <option value="Vagabond">Vagabond</option>
          </select>
        </div>
      </div>

      {/* Display the number of hits */}
      <div className="hits-display text-2xl mb-3">
        {attackerHits !== null && defenderHits !== null && (
          <>
            <p>
              <strong><span style={{ color: getFactionColor(attacker) }}>{attacker}</span></strong> gets <strong>{attackerHits}</strong> hits
            </p>
            <p>
              <strong><span style={{ color: getFactionColor(defender) }}>{defender}</span></strong> gets <strong>{defenderHits}</strong> hits
            </p>
          </>
        )}
      </div>


      {/* Roll Dice Button */}
      <div className="text-center">
        <button className="btn btn-primary text-white font-bold" style={{ width: '120px' }} onClick={rollDice}>
          Roll Dice
       </button>
      </div>
      </div>
      </div>

      {/* Total Victory Points and counter for every faction */}
      <div className="card bg-base-100 shadow-xl flex justify-center my-6 p-3">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-4">Total Victory Points</h2>

          {/* Marquise VP */}
          <div className="flex items-center justify-center space-x-4 mt-2">
            <h2 className="text-xl font-bold">Marquise de Cat</h2>
            <div className="flex items-center space-x-2">
            <button
              className="btn btn-circle text-white text-3xl"
              style={{ backgroundColor: '#ff7f7f' }}
              onClick={() => decrementPoints(setMarquisePoints, marquisePoints)}
            >
              -
            </button>
            <span className="text-2xl font-bold">{marquisePoints}</span>
            <button
              className="btn btn-circle text-white text-2xl"
              style={{ backgroundColor: '#90ee90' }}
              onClick={() => incrementPoints(setMarquisePoints, marquisePoints)}
            >
              +
            </button>
          </div>
          </div>

          {/* Eyrie VP */}
          <div className="flex items-center justify-center space-x-4 mt-2">
            <h2 className="text-xl font-bold">&nbsp;&nbsp;&nbsp;Eyrie Dynasty</h2>
            <div className="flex items-center space-x-2">
            <button
              className="btn btn-circle text-white text-3xl ml-3"
              style={{ backgroundColor: '#ff7f7f' }}
              onClick={() => decrementPoints(setEyriePoints, eyriePoints)}
            >
              -
            </button>
            <span className="text-2xl font-bold">{eyriePoints}</span>
            <button
              className="btn btn-circle text-white text-2xl"
              style={{ backgroundColor: '#90ee90' }}
              onClick={() => incrementPoints(setEyriePoints, eyriePoints)}
            >
              +
            </button>
          </div>
          </div>

          {/* Woodland Alliance VP */}
          <div className="flex items-center justify-center space-x-4 mt-2">
            <h2 className="text-xl font-bold">&nbsp;&nbsp;Woodland Alliance</h2>
            <div className="flex items-center space-x-2">
            <button
              className="btn btn-circle text-white text-3xl"
              style={{ backgroundColor: '#ff7f7f' }}
              onClick={() => decrementPoints(setWoodlandPoints, woodlandPoints)}
            >
              -
            </button>
            <span className="text-2xl font-bold">{woodlandPoints}</span>
            <button
              className="btn btn-circle text-white text-2xl"
              style={{ backgroundColor: '#90ee90' }}
              onClick={() => incrementPoints(setWoodlandPoints, woodlandPoints)}
            >
              +
            </button>
          </div>
          </div>

          {/* Vagabond VP */}
          <div className="flex items-center justify-center space-x-4 mt-2">
            <h2 className="text-xl font-bold">&nbsp;Vagabond</h2>
            <div className="flex items-center space-x-2">
            <button
              className="btn btn-circle text-white text-3xl"
              style={{ backgroundColor: '#ff7f7f' }}
              onClick={() => decrementPoints(setVagabondPoints, vagabondPoints)}
            >
              -
            </button>
            <span className="text-2xl font-bold">{vagabondPoints}</span>
            <button
              className="btn btn-circle text-white text-2xl"
              style={{ backgroundColor: '#90ee90' }}
              onClick={() => incrementPoints(setVagabondPoints, vagabondPoints)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      </div>

      <br/>

      {/* Back to Home Button */}
      <button className="btn btn-info text-white mb-3 font-bold" onClick={() => nav("/")}>
        Back to Home
      </button>
    </div>
  );
};
