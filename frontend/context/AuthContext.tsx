import React from "react";
import { User } from "../lib/endpoints/user";

// Actual auth data
interface AuthInfo {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

// Auth data and callbacks
interface AuthProps extends AuthInfo {
  setAuthInfo: (authInfo: AuthInfo) => void;
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
  const [authInfo, setAuthInfo] = React.useState<AuthInfo>(initialProps);

  React.useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || null;
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || null;
    setAuthInfo({ accessToken, refreshToken, user: null });
  }, []);

  // Clear auth info
  const clearAuthInfo = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    // TODO: blacklist refresh token
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAuthInfo({ accessToken: null, refreshToken: null, user: null });
  };

  //   const setToken = (accessToken: string) => {
  //     localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  //     setAccessToken(accessToken);
  //   };
  //   const clearToken = () => {
  //     localStorage.removeItem(ACCESS_TOKEN_KEY);
  //     setAccessToken("");
  //   };
  //   const value = { accessToken, setToken, clearToken };
  const value = { ...authInfo, setAuthInfo, clearAuthInfo };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// export const useLoginState = (): boolean => {
//   const { accessToken } = React.useContext(AuthContext);
//   return !!accessToken;
// };
