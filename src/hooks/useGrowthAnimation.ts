import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type GrowthStatus =
  | "idle"
  | "playing"
  | "paused"
  | "complete";

interface GrowthAnimation {
  progress: number;
  status: GrowthStatus;
  play: () => void;
  pause: () => void;
  restart: () => void;
  showComplete: () => void;
}

const DEFAULT_DURATION = 3500;

export function useGrowthAnimation(
  duration = DEFAULT_DURATION,
): GrowthAnimation {
  const [progress, setProgress] = useState(1);

  const [status, setStatus] =
    useState<GrowthStatus>("idle");

  const startTimeRef = useRef<number | null>(null);
  const startProgressRef = useRef(0);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    let animationFrameId = 0;

    function animate(timestamp: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed =
        timestamp - startTimeRef.current;

      const progressIncrease =
        elapsed / duration;

      const nextProgress = Math.min(
        1,
        startProgressRef.current +
          progressIncrease,
      );

      setProgress(nextProgress);

      if (nextProgress >= 1) {
        startTimeRef.current = null;
        setStatus("complete");
        return;
      }

      animationFrameId =
        window.requestAnimationFrame(animate);
    }

    animationFrameId =
      window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(
        animationFrameId,
      );
    };
  }, [duration, status]);

  const play = useCallback(() => {
    const startingProgress =
      progress >= 1 ? 0 : progress;

    setProgress(startingProgress);
    startProgressRef.current =
      startingProgress;

    startTimeRef.current = null;
    setStatus("playing");
  }, [progress]);

  const pause = useCallback(() => {
    startTimeRef.current = null;
    startProgressRef.current = progress;
    setStatus("paused");
  }, [progress]);

  const restart = useCallback(() => {
    startTimeRef.current = null;
    startProgressRef.current = 0;
    setProgress(0);
    setStatus("idle");
  }, []);

  const showComplete = useCallback(() => {
    startTimeRef.current = null;
    startProgressRef.current = 1;
    setProgress(1);
    setStatus("idle");
  }, []);

  return {
    progress,
    status,
    play,
    pause,
    restart,
    showComplete,
  };
}