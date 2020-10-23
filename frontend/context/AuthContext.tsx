import React from "react";
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
  //   setToken: (_token: string) => {},
  //   clearToken: () => {},
};

// Keys for browser storage
const ACCESS_TOKEN_KEY = "FRI_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "FRI_REFRESH_TOKEN";

export const AuthContext = React.createContext<AuthProps>(initialProps);

AuthContext.displayName = "AuthContext";

// Custom provider to implement auth state
export const AuthProvider: React.FC = ({ children }) => {
  // TODO: Token refresh endpoint?
  const [authInfo, setAuthInfo] = React.useState<AuthInfo>(initialProps);

  // Set the authentication info in global context and localstorage
  const setAuth = (authInfo: RequiredAuthInfo) => {
    setAuthInfo(authInfo);
    localStorage.setItem(ACCESS_TOKEN_KEY, authInfo.accessToken);
    localStorage.setItem(ACCESS_TOKEN_KEY, authInfo.refreshToken);
  };

  // Clear auth info
  const clearAuthInfo = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    // TODO: blacklist refresh token
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAuthInfo({ accessToken: null, refreshToken: null, user: null });
  };

  React.useEffect(() => {
    const loadAuth = async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || null;
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || null;
      // TODO: Check if still valid

      // const refreshData = deco

      // setAuth({ accessToken, refreshToken, user: null });
    };
  }, []);

  const value = { ...authInfo, setAuthInfo: setAuth, clearAuthInfo };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// export const useLoginState = (): boolean => {
//   const { accessToken } = React.useContext(AuthContext);
//   return !!accessToken;
// };
