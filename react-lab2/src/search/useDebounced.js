import { useEffect, useState } from "react";

export function useDebounced(value, ms) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, ms);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, ms]);

  return debouncedValue;
}
