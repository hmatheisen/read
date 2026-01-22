import { useEffect, useState } from "react";

const useDebounce = <T>(cb: T, delay: number) => {
  const [debounceValue, setDebounceValue] = useState<T>(cb);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(cb);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [cb, delay]);

  return debounceValue;
};

export default useDebounce;
