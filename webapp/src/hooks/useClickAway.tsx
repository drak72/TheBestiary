import { useEffect, useRef } from "react";

/** Adapted from https://www.robinwieruch.de/react-hook-detect-click-outside-component/ */
export const useClickAway = (
  callback: () => void,
): React.RefObject<HTMLDivElement | null> => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      /** @ts-expect-error  Event typing issues*/
      if (ref.current && !ref.current?.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [ref, callback]);

  return ref;
};
