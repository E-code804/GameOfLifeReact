/* eslint-disable react/prop-types */
import { memo } from "react";

const Cell = memo(function Cell({ isAlive }) {
  return <div className={isAlive === 1 ? "alive-bg" : "gray-bg"}></div>;
});

export default Cell;
