import React from "react";
import jwt from "jsonwebtoken";
import { User, userAPI } from "../lib/endpoints/user";

// Actual auth data
interface AuthInfo {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

type RequiredAuthInfo = {
  [K in keyof AuthInfo]: NonNullable<AuthInfo[K]>;
};

// Auth data and callbacks
interface AuthProps extends AuthInfo {
  authLoading: boolean;
  setAuthInfo: (authInfo: RequiredAuthInfo) => void;
  clearAuthInfo: () => void;
}

const initialInfo: AuthInfo = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const initialProps: AuthProps = {
  ...initialInfo,
  authLoading: true,
  setAuthInfo: (_authInfo) => {},
  clearAuthInfo: () => {},
};

// Keys for browser storage
const ACCESS_TOKEN_KEY = "FRI_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "FRI_REFRESH_TOKEN";

const TEN_MINUTES_MS = 600000;

export const AuthContext = React.createContext<AuthProps>(initialProps);

AuthContext.displayName = "AuthContext";

const authReducer = (
  authInfo: AuthInfo,
  partialauthInfo: Partial<AuthInfo>
) => ({
  ...authInfo,
  ...partialauthInfo,
});

// Custom provider to implement auth state
export const AuthProvider: React.FC = ({ children }) => {
  const [authInfo, setAuthInfo] = React.useReducer(authReducer, initialInfo);
  const [authLoading, setAuthLoading] = React.useState<boolean>(true);

  // Set the valid authentication info in global context and localstorage
  const setAuth = React.useCallback(
    (authInfo: RequiredAuthInfo) => {
      setAuthInfo(authInfo);
      localStorage.setItem(ACCESS_TOKEN_KEY, authInfo.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, authInfo.refreshToken);
    },
    [setAuthInfo]
  );

  // Clear auth info from global context and localstorage
  const clearAuthInfo = React.useCallback(() => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAuthInfo({ accessToken: null, refreshToken: null, user: null });
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
      setAuthInfo({
        accessToken: tokenResponse.data.access,
        refreshToken: tokenResponse.data.refresh,
      });
    } catch {
      // TODO: deal with condition where refresh API fails due to invalid token or
      // other network error
      clearAuthInfo(); // this should be conditional
    }
  }, [setAuthInfo, clearAuthInfo]);

  React.useEffect(() => {
    // Initialize auth state based on localstorage
    const loadAuth = async () => {
      setAuthLoading(true);
      const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || null;
      const storedRefreshToken =
        localStorage.getItem(REFRESH_TOKEN_KEY) || null;

      if (!storedAccessToken || !storedRefreshToken) {
        setAuthLoading(false);
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
        setAuthLoading(false);
        const refreshTimer = setInterval(refreshAuth, TEN_MINUTES_MS);
        return () => clearInterval(refreshTimer);
      } catch {
        // Throws decoding error if invalid or expired
        // Other potential errors when requesting new token set or getting user info
        clearAuthInfo();
        setAuthLoading(false);
        return;
      }
    };

    loadAuth();
  }, [setAuth, clearAuthInfo, refreshAuth]);

  const value: AuthProps = {
    ...authInfo,
    authLoading,
    setAuthInfo: setAuth,
    clearAuthInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
