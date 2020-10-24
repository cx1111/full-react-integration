import React from "react";
import { useRouter } from "next/router";
import { AuthContext } from "./AuthContext";

export const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const router = useRouter();
  // console.log(router.pathname);
  const { user, authLoading } = React.useContext(AuthContext);
  if (authLoading) {
    return <div>Wait...</div>;
  }
  if (!authLoading && !user) {
    router.push("/login");
    return null;
  }
  return children;
};
