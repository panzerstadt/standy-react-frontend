import React from "react";

const TRAIN_LINES = ["Yamanote", "Chuo", "Sobu", "Tozai", "Shinjuku", "Ginza"];

const TrainLines = ({ onSelect }) => {
  const handleChange = e => {
    onSelect && onSelect(e.target.value);
  };

  return (
    <div>
      which train line are you taking today?
      <br />
      <select onChange={handleChange} name="train line" id="train-line">
        {TRAIN_LINES.map(v => {
          return (
            <option key={v} value={v}>
              {v}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default TrainLines;
