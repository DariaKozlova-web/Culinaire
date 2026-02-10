import { Outlet } from "react-router";

import useAuth from "../contexts/useAuth";

const ProtectedOnlyAdmin = () => {
  const { user } = useAuth();

  if (!user!.roles?.some((role) => role === "admin"))
    return <p className="text-red-600">Access denied! Only admins allowed!</p>;
  return <Outlet />;
};

export default ProtectedOnlyAdmin;
