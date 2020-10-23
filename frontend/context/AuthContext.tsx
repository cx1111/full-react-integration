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
  setAuthInfo: (authInfo: RequiredAuthInfo) => void;
  clearAuthInfo: () => void;
}

const initialProps: AuthProps = {
  accessToken: null,
  refreshToken: null,
  user: null,
  setAuthInfo: (_authInfo) => {},
  clearAuthInfo: () => {},
};

// Keys for browser storage
const ACCESS_TOKEN_KEY = "FRI_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "FRI_REFRESH_TOKEN";

const FIVE_MINUTES_MS = 300000;

export const AuthContext = React.createContext<AuthProps>(initialProps);

AuthContext.displayName = "AuthContext";

// Custom provider to implement auth state
export const AuthProvider: React.FC = ({ children }) => {
  // TODO: Token refresh endpoint?
  const [authInfo, setAuthInfo] = React.useState<AuthInfo>(initialProps);

  // Set the authentication info in global context and localstorage
  const setAuth = React.useCallback(
    (authInfo: RequiredAuthInfo) => {
      console.log("this again?");
      setAuthInfo(authInfo);
      localStorage.setItem(ACCESS_TOKEN_KEY, authInfo.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, authInfo.refreshToken);
    },
    [setAuthInfo]
  );

  // Clear auth info
  const clearAuthInfo = React.useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAuthInfo({ accessToken: null, refreshToken: null, user: null });
    // try {
    //   authInfo.refreshToken &&
    //     userAPI.blacklistToken({ refresh: authInfo.refreshToken });
    // } catch {}
  }, [setAuthInfo]);

  // Update the refresh and access tokens if authenticated
  const refreshAuth = React.useCallback(async () => {
    if (!authInfo.refreshToken || !authInfo.user) {
      return;
    }

    try {
      jwt.decode(authInfo.refreshToken);
      const tokenResponse = await userAPI.refreshToken({
        refresh: authInfo.refreshToken,
      });
      setAuth({
        accessToken: tokenResponse.data.access,
        refreshToken: tokenResponse.data.refresh,
        user: authInfo.user,
      });
    } catch {
      // TODO: condition where refresh API fails due to invalid token or
      // other network error
    }
  }, [authInfo, setAuth]);

  React.useEffect(() => {
    // Initialize auth state based on localstorage
    const loadAuth = async () => {
      const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || null;
      const storedRefreshToken =
        localStorage.getItem(REFRESH_TOKEN_KEY) || null;

      if (!storedAccessToken || !storedRefreshToken) {
        return;
      }

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
        console.log("Done this effect");
        // setInterval(refreshAuth, FIVE_MINUTES_MS);
      } catch {
        // Throws decoding error if invalid or expired
        // Other potential errors when requesting new token set or getting user info
        clearAuthInfo();
        return;
      }
    };

    loadAuth();
  }, [setAuth, clearAuthInfo, refreshAuth]);

  const value = { ...authInfo, setAuthInfo: setAuth, clearAuthInfo };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
