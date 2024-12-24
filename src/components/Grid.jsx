import { useCallback, useEffect, useMemo, useState } from "react";
import Cell from "./Cell";

const Grid = () => {
  const [gridSize, setGridSize] = useState(10);
  const [simulationSpeed, setSimulationSpeed] = useState(500);
  const [steps, setSteps] = useState(0);
  const [simulationStopped, setSimulationStopped] = useState("");
  const [runSimulation, setRunSimulation] = useState(true);
  const [grid, setGrid] = useState(
    Array.from({ length: gridSize }, () => Array(gridSize).fill(0))
  );

  // Depending on what grid size the user wants, this will determine the css styling
  const gridSizeStyles = {
    10: 40,
    25: 15,
    50: 6,
  };
  const gridStyles = {
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    gridAutoRows: `${gridSizeStyles[gridSize]}px`,
  };

  // constant for initial number of alive cells, memoize
  const startAlive = useMemo(
    () => Math.floor(gridSize * gridSize * 0.2),
    [gridSize]
  );

  const toggleRun = () => setRunSimulation((prevRun) => !prevRun);

  const startBoard = useCallback(
    (isRandomStart) => {
      setSteps(0);
      setSimulationStopped("");
      const newGrid = Array.from({ length: gridSize }, () =>
        Array(gridSize).fill(0)
      );

      if (isRandomStart) {
        const randomIntegers = Array.from({ length: startAlive }, () =>
          Math.floor(Math.random() * gridSize * gridSize)
        );
        randomIntegers.forEach((i) => {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          newGrid[row][col] = 1;
        });
      } else {
        newGrid[3][4] = 1;
        newGrid[5][3] = 1;
        newGrid[5][4] = 1;
        newGrid[5][5] = 1;
        newGrid[4][5] = 1;
      }

      setGrid(newGrid);
    },
    [gridSize, startAlive]
  );

  useEffect(() => {
    startBoard(false);
  }, [startAlive, startBoard]);

  useEffect(() => {
    const runGameOfLife = () => {
      // Stop game if no changes
      let didChange = false;
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => [...row]);

        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            const rowAbove = (i - 1 + gridSize) % gridSize;
            const rowBelow = (i + 1) % gridSize;
            const colAbove = (j - 1 + gridSize) % gridSize;
            const colBelow = (j + 1) % gridSize;
            const neighbors =
              prevGrid[rowAbove][colAbove] +
              prevGrid[rowAbove][j] +
              prevGrid[rowAbove][colBelow] +
              prevGrid[i][colAbove] +
              prevGrid[i][colBelow] +
              prevGrid[rowBelow][colAbove] +
              prevGrid[rowBelow][j] +
              prevGrid[rowBelow][colBelow];

            if (prevGrid[i][j] === 1) {
              // If cell is alive
              if (neighbors < 2 || neighbors > 3) {
                // die
                newGrid[i][j] = 0;
              } else {
                // stay alive
                newGrid[i][j] = 1;
              }
              didChange = true;
            } else {
              // If cell is dead
              if (neighbors === 3) {
                // become alive
                newGrid[i][j] = 1;
              } else {
                // stay dead
                newGrid[i][j] = 0;
              }
              didChange = true;
            }
          }
        }
        setSteps((prevSteps) => prevSteps + 1);

        if (!didChange) {
          setRunSimulation((prevRun) => !prevRun);
          setSimulationStopped("Simulation does not change from here!");
        }
        return newGrid;
      });
    };

    if (runSimulation) {
      const interval = setInterval(runGameOfLife, simulationSpeed);
      return () => clearInterval(interval);
    }
  }, [runSimulation, gridSize, simulationSpeed]);

  return (
    <div className="grid-main">
      <h1>Conway&apos;s Game of Life</h1>

      <div className="grid" style={gridStyles}>
        {grid.map((row, rid) =>
          row.map((cell, cid) => <Cell key={`${rid}-${cid}`} isAlive={cell} />)
        )}
      </div>

      <h1>
        Number of Steps: {steps}{" "}
        {simulationStopped !== "" ? ` - ${simulationStopped}` : ""}
      </h1>

      <div className="button-group">
        <button onClick={toggleRun}>{runSimulation ? "Pause" : "Play"}</button>
        <button onClick={() => startBoard(false)}>Restart</button>
        <button onClick={() => startBoard(true)}>Randomize Cell Start</button>
      </div>

      <div className="button-group">
        <h3>Set grid size:</h3>
        <button onClick={() => setGridSize(10)}>10</button>
        <button onClick={() => setGridSize(25)}>25</button>
        <button onClick={() => setGridSize(50)}>50</button>
      </div>

      <div className="button-group">
        <h3>Set speed:</h3>
        <button onClick={() => setSimulationSpeed(1000)}>0.5x</button>
        <button onClick={() => setSimulationSpeed(500)}>1.0x</button>
        <button onClick={() => setSimulationSpeed(375)}>1.5x</button>
        <button onClick={() => setSimulationSpeed(250)}>2.0x</button>
      </div>
    </div>
  );
};

export default Grid;
