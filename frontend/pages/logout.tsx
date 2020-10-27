import React from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";

const Logout: React.FC = ({}) => {
  const router = useRouter();
  const { user, authLoading, clearAuthInfo } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (user) {
      clearAuthInfo();
    }
    if (!authLoading && process.browser) {
      router.push("/");
    }
  }, [user, authLoading, clearAuthInfo, router]);
  return null;
};

export default Logout;
