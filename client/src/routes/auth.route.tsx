import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthRoute } from "./common/routePaths";

const AuthRoute = () => {
  const location = useLocation();
  const { data: authData, isLoading } = useAuth();
  const user = authData?.data;

  const _isAuthRoute = isAuthRoute(location.pathname);

  console.log("AuthRoute - location:", location.pathname);
  console.log("AuthRoute - authData:", authData);
  console.log("AuthRoute - user:", user);
  console.log("AuthRoute - _isAuthRoute:", _isAuthRoute);

  if (isLoading && !_isAuthRoute) return <DashboardSkeleton />;

  if (!user) return <Outlet />;

  return <Navigate to={`workspace/${user.currentWorkspace?._id}`} replace />;
};

export default AuthRoute;
