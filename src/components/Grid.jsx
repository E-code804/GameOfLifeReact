import { useEffect, useState } from "react";
import Cell from "./Cell";

// TODO: Memoize where possible, slider for speed, better colors, fix rules if nec.

const Grid = () => {
  // Dimensions, turn to set later
  const gridSize = 10;
  const [steps, setSteps] = useState(0);
  const [runSimulation, setRunSimulation] = useState(true);
  const [grid, setGrid] = useState(
    Array.from({ length: gridSize }, () => Array(gridSize).fill(0))
  );

  // constant for initial number of alive cells, memoize
  const startAlive = Math.floor(gridSize * gridSize * 0.2);

  const startBoard = (isRandomStart) => {
    setSteps(0);
    const newGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

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
  };

  const runGameOfLife = () => {
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
          } else {
            // If cell is dead
            if (neighbors === 3) {
              // become alive
              newGrid[i][j] = 1;
            } else {
              // stay dead
              newGrid[i][j] = 0;
            }
          }
        }
      }
      setSteps((prevSteps) => prevSteps + 1);
      return newGrid;
    });
  };

  const toggleRun = () => setRunSimulation((prevRun) => !prevRun);
  const toggleStart = () => {
    startBoard(true);
  };

  useEffect(() => {
    startBoard(false);
  }, [startAlive]);

  useEffect(() => {
    if (runSimulation) {
      const interval = setInterval(runGameOfLife, 500);
      return () => clearInterval(interval);
    }
  }, [runSimulation]);

  return (
    <div className="grid-main">
      <div className="grid">
        {grid.map((row, rid) =>
          row.map((cell, cid) => <Cell key={`${rid}-${cid}`} isAlive={cell} />)
        )}
      </div>

      <h1>Number of Steps: {steps}</h1>

      <div className="button-group">
        <button onClick={toggleRun}>{runSimulation ? "Pause" : "Play"}</button>
        <button onClick={() => startBoard(false)}>Restart</button>
        <button onClick={toggleStart}>Randomize Cell Start</button>
      </div>
    </div>
  );
};

export default Grid;
