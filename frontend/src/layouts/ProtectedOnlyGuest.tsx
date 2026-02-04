import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import useAuth from "../contexts/useAuth";

const ProtectedOnlyGuest = () => {
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/login");
  }, [user, navigate, authLoading]);

  if (authLoading) return <p>Loading...</p>;
  if (!user) return null;
  if (!user.roles?.some((role) => role === "user"))
    return <p>"Access denied. Only users allowed."</p>;
  return <Outlet />;
};

export default ProtectedOnlyGuest;
