import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-10-10T07:00:00+01:00").getTime();

function getTimeLeft() {
  const difference = EVENT_DATE - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      finished: true,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    finished: false,
  };
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (timeLeft.finished) {
    return (
      <div className="countdown-finished">
        <span>THE FESTIVAL IS HERE</span>
      </div>
    );
  }

  const units = [
    ["days", timeLeft.days],
    ["hours", timeLeft.hours],
    ["minutes", timeLeft.minutes],
    ["seconds", timeLeft.seconds],
  ];

  return (
    <div className="countdown">
      <p>THE COUNTDOWN IS ON</p>

      <div className="countdown-grid">
        {units.map(([label, value]) => (
          <div className="countdown-item" key={label}>
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Countdown;