import React from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";

const Logout: React.FC = ({}) => {
  const router = useRouter();
  const { user, clearAuthInfo } = React.useContext(AuthContext);

  if (user) {
    clearAuthInfo();
  }
  if (process.browser) {
    router.push("/");
  }
  return null;
};

export default Logout;
