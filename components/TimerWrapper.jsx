import { useEffect } from "react";

import { getAuthCookie } from "utils/cookie";

const INTERVAL_DURATION = 1000 * 60 * 5;

function TimerWrapper({ children }) {
  const handleTimerCheck = () => {
    console.log("Heartbeat ♡");
    const token = getAuthCookie();
    if (!token) {
      window.location.href = "/sign-in";
    }
  };

  useEffect(() => {
    const interval = setInterval(handleTimerCheck, INTERVAL_DURATION);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return children;
}

export default TimerWrapper;
