import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import FadeLoader from "react-spinners/FadeLoader";

import useAuth from "../contexts/useAuth";

const ProtectedOnlyUser = () => {
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();
  const [showLoaderDuringMinTime, setShowLoaderDuringMinTime] = useState(false);

  useEffect(() => {
    if (user || showLoaderDuringMinTime) return;
    if (authLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowLoaderDuringMinTime(true);
      const timer = setTimeout(() => {
        setShowLoaderDuringMinTime(false);
        clearTimeout(timer);
      }, 1000); // Minimum loader display time of 1000ms
    } else navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, showLoaderDuringMinTime]);

  if (authLoading || showLoaderDuringMinTime)
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <FadeLoader
          color="#f2c9a0"
          height={20}
          width={6}
          radius={2}
          margin={4}
        />
      </div>
    );
  if (!user) return null;
  return <Outlet />;
};

export default ProtectedOnlyUser;
