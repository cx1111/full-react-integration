import React from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";

// Only returns child page if authenticated
export const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const router = useRouter();
  const { isAuthenticated, authLoading } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated && process.browser) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (isAuthenticated) {
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
  const { isAuthenticated, authLoading } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (!authLoading && isAuthenticated && process.browser && redirectTo) {
      router.push(redirectTo);
    }
  }, [redirectTo, authLoading, isAuthenticated, router]);

  if (!authLoading && !isAuthenticated) {
    return children;
  }
  return null;
};
