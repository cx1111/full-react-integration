import React from "react";
import jwt from "jsonwebtoken";
import { User, userAPI } from "../lib/endpoints/user";
import { getGenericReducer } from "../lib/utils/reducer";

// Actual auth data
interface AuthInfo {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  // Loading param here instead of AuthProps to ensure status is updated
  // with main info, due to async and batched hook updates
  authLoading: boolean;
}

// Data to set for an authenticated user
interface PresentAuthInfo {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Auth data and callbacks
interface AuthProps extends AuthInfo {
  setAuthInfo: (authInfo: PresentAuthInfo) => void;
  clearAuthInfo: () => void;
}

const initialInfo: AuthInfo = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  authLoading: true,
};

const initialProps: AuthProps = {
  ...initialInfo,
  setAuthInfo: (_authInfo) => {},
  clearAuthInfo: () => {},
};

// Key for browser storage
const REFRESH_TOKEN_KEY = "FRI_REFRESH_TOKEN";

const AUTH_REFRESH_INTERVAL = 600000;

export const AuthContext = React.createContext<AuthProps>(initialProps);

AuthContext.displayName = "AuthContext";

// Custom provider to implement auth state
export const AuthProvider: React.FC = ({ children }) => {
  const [authInfo, setAuthInfo] = React.useReducer(
    getGenericReducer<AuthInfo>(),
    initialInfo
  );

  // Set the valid authentication info in global context and localstorage
  const setAuth = React.useCallback(
    (authInfo: PresentAuthInfo) => {
      setAuthInfo({ ...authInfo, isAuthenticated: true, authLoading: false });
      localStorage.setItem(REFRESH_TOKEN_KEY, authInfo.refreshToken);
    },
    [setAuthInfo]
  );

  // Clear auth info from global context and localstorage
  const clearAuthInfo = React.useCallback(() => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAuthInfo({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      authLoading: false,
    });
    try {
      storedRefreshToken &&
        userAPI.blacklistToken({ refresh: storedRefreshToken });
    } catch {}
  }, [setAuthInfo]);

  // Update the refresh and access tokens if authenticated.
  // Avoid using authInfo directly to avoid infinite loop?
  const refreshAuth = React.useCallback(async () => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefreshToken) {
      return;
    }

    try {
      jwt.decode(storedRefreshToken);
      const tokenResponse = await userAPI.refreshToken({
        refresh: storedRefreshToken,
      });
      const userResponse = await userAPI.viewUser(tokenResponse.data.access);

      if (!userResponse.data.user) {
        throw new Error("Failed to get user");
      }
      setAuth({
        accessToken: tokenResponse.data.access,
        refreshToken: tokenResponse.data.refresh,
        user: userResponse.data.user,
      });
    } catch {
      // TODO: deal with condition where refresh API fails due to invalid token or
      // other network error
      clearAuthInfo(); // this should be conditional
    }
  }, [setAuth, clearAuthInfo]);

  React.useEffect(() => {
    // Initialize auth state based on localstorage
    const loadAuth = async () => {
      const storedRefreshToken =
        localStorage.getItem(REFRESH_TOKEN_KEY) || null;

      if (!storedRefreshToken) {
        clearAuthInfo();
        return;
      }

      // Process the auth info from localstorage if present
      try {
        jwt.decode(storedRefreshToken);
        // If the refresh token is valid, load a new set of tokens to extend auth time
        const tokenResponse = await userAPI.refreshToken({
          refresh: storedRefreshToken,
        });
        const userResponse = await userAPI.viewUser(tokenResponse.data.access);

        if (!userResponse.data.user) {
          throw new Error("Failed to get user");
        }
        setAuth({
          accessToken: tokenResponse.data.access,
          refreshToken: tokenResponse.data.refresh,
          user: userResponse.data.user,
        });
      } catch {
        // Throws decoding error if invalid or expired
        // Other potential errors when requesting new token set or getting user info
        clearAuthInfo();
        return;
      }
    };

    loadAuth();
    const refreshTimer = setInterval(refreshAuth, AUTH_REFRESH_INTERVAL);
    return () => clearInterval(refreshTimer);
  }, [setAuth, clearAuthInfo, refreshAuth]);

  const value: AuthProps = {
    ...authInfo,
    setAuthInfo: setAuth,
    clearAuthInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
