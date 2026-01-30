import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { AuthForms, type IUserAuth } from "../components/AuthForms";
import useAuth from "../contexts/useAuth";
import { getMe, login, register } from "../data";

function Authentication() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerData, setRegisterData] = useState<Pick<
    IUserAuth,
    "email" | "password" | "name"
  > | null>(null);

  const handleRegisterSubmit = async (
    userData: Pick<
      IUserAuth,
      "email" | "password" | "confirmPassword" | "name"
    >,
  ) => {
    try {
      setRegisterLoading(true);
      await register(userData);
      setRegisterData(userData);
      setRegisterSuccess(true);
    } catch (error) {
      console.error("Registration failed:", error);
      const message = (error as { message: string }).message;
      toast.error(message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleRegisterSuccessAfter = async () => {
    if (registerSuccess && registerData !== null) {
      await handleLoginSubmit({
        email: registerData.email,
        password: registerData.password,
      });
      setRegisterData(null);
    }
  };

  const handleLoginSubmit = async (
    userData: Pick<IUserAuth, "email" | "password">,
  ) => {
    try {
      setLoginLoading(true);
      await login(userData);
      const { user } = await getMe();
      setUser(user);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      const message = (error as { message: string }).message;
      toast.error(message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      <AuthForms
        onLoginSubmit={handleLoginSubmit}
        onRegisterSubmit={handleRegisterSubmit}
        registerSuccess={registerSuccess}
        registerLoading={registerLoading}
        loginLoading={loginLoading}
        onOkBtnClick={handleRegisterSuccessAfter}
      />
    </>
  );
}

export default Authentication;
