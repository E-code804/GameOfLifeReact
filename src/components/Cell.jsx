/* eslint-disable react/prop-types */
const Cell = ({ isAlive }) => {
  return <div className={isAlive === 1 ? "alive-bg" : "gray-bg"}></div>;
};

export default Cell;
