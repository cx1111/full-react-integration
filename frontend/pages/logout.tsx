import React from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";

const Logout: React.FC = ({}) => {
  const router = useRouter();
  const { isAuthenticated, authLoading, clearAuthInfo } = React.useContext(
    AuthContext
  );

  React.useEffect(() => {
    if (isAuthenticated) {
      clearAuthInfo();
    }
    if (!authLoading && process.browser) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, clearAuthInfo, router]);
  return null;
};

export default Logout;
