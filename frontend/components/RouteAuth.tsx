import React from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";

// Only returns child page if authenticated
export const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const router = useRouter();
  const { user, authLoading } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (!authLoading && !user && process.browser) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  if (user) {
    return children;
  }
  return null;
};

// Only returns child page if not authenticated
export const NoAuthRoute: React.FC<{
  redirectTo?: string;
  children: JSX.Element;
}> = ({ redirectTo, children }) => {
  const router = useRouter();
  const { user, authLoading } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (!authLoading && user && process.browser && redirectTo) {
      router.push(redirectTo);
    }
  }, [redirectTo, authLoading, user, router]);

  if (!authLoading && !user) {
    return children;
  }
  return null;
};
