import { useEffect, useRef, useState } from "react";

export function useToastNotice(durationMs = 1400) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const showNotice = (message: string) => {
    setToastMessage(null);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    requestAnimationFrame(() => {
      setToastMessage(message);
      timerRef.current = window.setTimeout(() => {
        setToastMessage(null);
        timerRef.current = null;
      }, durationMs);
    });
  };

  return { toastMessage, showNotice };
}
