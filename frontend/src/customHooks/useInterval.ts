import { useRef, useEffect } from 'react';

type intervalCallbackType = () => void;

export default function useInterval(callback: intervalCallbackType, delay: number) {
  const savedCallback = useRef<intervalCallbackType>();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      if (savedCallback.current === undefined) return;
      savedCallback.current();
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
