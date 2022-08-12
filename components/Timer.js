import { useTimer } from "react-timer-hook";

export function Timer({ expiryTimestamp, onExpire }) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire });

  return (
    <>
      {" "}
      <span>{minutes}</span>:<span>{seconds.toString().padStart(2, "0")}</span>
    </>
  );
}
