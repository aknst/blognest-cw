import { FullPageLoader } from "@/pages/misc/FullLoaderPage";
import { useAuthStore } from "@/states/auth-state";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute: React.FC = () => {
  const { isLoading, userDetails } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!userDetails) {
    const loginRedirectUrl = `/login?callbackUrl=${encodeURIComponent(
      location.pathname
    )}`;
    return <Navigate to={loginRedirectUrl} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
