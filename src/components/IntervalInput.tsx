import React from "react";

function IntervalInput(props: {
  interval: string;
  setInterval: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { interval, setInterval } = props;

  const intervalOptions = {
    "1min": "1 minute",
    "5min": "5 minutes",
    "15min": "15 minutes",
    "30min": "30 minutes",
    "60min": "1 hour",
  };

  return (
    <label className="intervalLabel">
      <h4>Select interval</h4>
      <select value={interval} onChange={(e) => setInterval(e.target.value)}>
        {Object.entries(intervalOptions).map(
          ([intervalValue, intervalLabel]) => (
            <option key={intervalValue} value={intervalValue}>
              {intervalLabel}
            </option>
          )
        )}
      </select>
    </label>
  );
}

export default IntervalInput;
