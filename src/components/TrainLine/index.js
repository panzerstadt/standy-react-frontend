import React, { useState } from "react";

const TRAIN_LINES = ["Yamanote", "Chuo", "Sobu", "Tozai", "Shinjuku", "Ginza"];

const TrainLines = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);
  const handleChange = e => {
    setSelected(e.target.value);
    onSelect && onSelect(e.target.value);
  };

  return (
    <div>
      {selected
        ? `your train line: ${selected}`
        : "which train line are you taking today?"}
      <br />
      {!selected && (
        <select
          onChange={handleChange}
          name="train line"
          id="train-line"
          defaultValue="none"
        >
          <option value="none" disabled hidden>
            Select your first train line
          </option>
          {TRAIN_LINES.map(v => {
            return (
              <option key={v} value={v}>
                {v}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};

export default TrainLines;
