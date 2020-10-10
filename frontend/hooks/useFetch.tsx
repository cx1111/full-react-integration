// Hook for fetching data from an endpoint
import React from "react";

type UseFetch<T> = [
  { data?: T; loading: boolean; error?: string },
  {
    setLoading(loading: boolean): void;
    setError(error?: string): void;
    setData(data?: T): void;
  }
];

type InitialState<T> = {
  loading?: boolean;
  error?: string;
  data?: T | (() => T);
};

const defaultInitialState = {
  loading: false,
  error: "",
  data: undefined,
};

export const useFetch = <T,>(state?: InitialState<T>): UseFetch<T> => {
  const initialState = {
    ...defaultInitialState,
    ...state,
  };
  const [loading, setLoading] = React.useState(initialState.loading);
  const [error, setError] = React.useState(initialState.error);
  const [data, setData] = React.useState<T | undefined>(initialState.data);

  const mounted = React.useRef(false);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const safeSetLoading = React.useCallback((loadingState: boolean) => {
    if (mounted.current) {
      setLoading(loadingState);
    }
  }, []);

  const safeSetError = React.useCallback((e: string) => {
    if (mounted.current) {
      setError(e);
    }
  }, []);

  const safeSetData = React.useCallback((d?: T) => {
    if (mounted.current) {
      setData(d);
    }
  }, []);

  const actions = React.useMemo(
    () => ({
      setLoading: safeSetLoading,
      setError: safeSetError,
      setData: safeSetData,
    }),
    [safeSetData, safeSetError, safeSetLoading]
  );

  return [{ loading, error, data }, actions];
};
