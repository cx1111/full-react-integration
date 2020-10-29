// Hook for fetching data from an endpoint
import React from "react";

type UseFetch<T, TE> = [
  { data?: T; loading: boolean; error?: TE },
  {
    setLoading(loading: boolean): void;
    setError(error?: TE): void;
    setData(data?: T): void;
  }
];

type InitialState<T, TE> = {
  loading?: boolean;
  error?: TE;
  data?: T | (() => T);
};

const defaultInitialState = {
  loading: false,
  error: undefined,
  data: undefined,
};

export const useFetch = <T, TE = string>(
  state?: InitialState<T, TE>
): UseFetch<T, TE> => {
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

  const safeSetError = React.useCallback((e: TE) => {
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
