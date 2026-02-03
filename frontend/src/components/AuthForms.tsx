import { Field, Form, Formik } from "formik";
import { FiCheckCircle } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiMaildotru } from "react-icons/si";
import { TbUser } from "react-icons/tb";
import { HashLoader, PropagateLoader } from "react-spinners";

import { ModalWindowBackdrop } from "../components/ModalBackDrop";
import "../styles/AuthForms.css";

export interface IUserAuth {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

interface IProps {
  showLoginForm?: boolean;
  onLoginSubmit: (userAuthData: Pick<IUserAuth, "email" | "password">) => void;
  onRegisterSubmit: (
    userAuthData: Pick<
      IUserAuth,
      "email" | "password" | "confirmPassword" | "name"
    >,
  ) => void;
  onOkBtnClick: () => void;
  registerSuccess: boolean;
  registerLoading: boolean;
  loginLoading: boolean;
}
export const AuthForms = ({
  showLoginForm = true,
  onLoginSubmit,
  onRegisterSubmit,
  onOkBtnClick,
  registerSuccess,
  registerLoading,
  loginLoading,
}: IProps) => {
  const initialLogIn: Pick<IUserAuth, "email" | "password"> = {
    email: "",
    password: "",
  };
  const initialRegister: Pick<
    IUserAuth,
    "email" | "password" | "confirmPassword" | "name"
  > = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  };

  return (
    <div className="authFormsWrapper relative z-50">
      <div className="section">
        <div className="ralative container mx-auto">
          {registerSuccess && registerLoading === false && loginLoading && (
            <div className="flex-center-center absolute top-0 left-0 z-50 h-full w-full bg-[#1f2029]">
              <HashLoader color="#fff" />
            </div>
          )}
          <div className="row full-height justify-content-center">
            <div className="align-self-center col-12 py-5 text-center">
              <div className="section pt-sm-2 pt-5 pb-5 text-center">
                <h6 className="mb-0 pb-3">
                  <span>Log In </span>
                  <span>Sign Up</span>
                </h6>
                <input
                  className="checkbox"
                  type="checkbox"
                  defaultChecked={!showLoginForm}
                  id="reg-log"
                  name="reg-log"
                />
                <label htmlFor="reg-log"></label>
                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
                    <div className="card-front">
                      <div className="center-wrap">
                        <div className="section text-center">
                          {loginLoading === false && (
                            <h4 className="mb-4 pb-3">Log In</h4>
                          )}
                          <Formik
                            initialValues={initialLogIn}
                            onSubmit={(values, actions) => {
                              onLoginSubmit(values);
                              actions.resetForm();
                            }}
                          >
                            <Form>
                              {loginLoading === false && (
                                <>
                                  <div className="relative mb-2">
                                    <Field
                                      type="email"
                                      name="email"
                                      className="form-style"
                                      placeholder="Your Email"
                                      id="logemail"
                                      autoComplete="off"
                                    />
                                    <div>
                                      <SiMaildotru className="input-icon" />
                                    </div>
                                  </div>
                                  <div className="relative">
                                    <Field
                                      type="text"
                                      name="password"
                                      className="form-style"
                                      placeholder="Your Password"
                                      id="logpass"
                                      autoComplete="off"
                                    />
                                    <div>
                                      <RiLockPasswordLine className="input-icon uil" />
                                    </div>
                                  </div>
                                  <button type="submit" className="btn mt-4">
                                    submit
                                  </button>
                                </>
                              )}
                              {loginLoading && (
                                <div className="text-Green flex-center-center h-[230px] flex-col uppercase">
                                  <PropagateLoader color="#36d7b7" />
                                </div>
                              )}
                            </Form>
                          </Formik>
                          {loginLoading === false && (
                            <p className="mt-4 mb-0 text-center">
                              <a href="#0" className="link">
                                Forgot your password?
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="card-back">
                      <div className="center-wrap">
                        <div className="section text-center">
                          {registerLoading === false &&
                            (registerSuccess ? (
                              <h4 className="mb-4 pb-3">Great!</h4>
                            ) : (
                              <h4 className="mb-4 pb-3">Sign Up</h4>
                            ))}
                          <Formik
                            initialValues={initialRegister}
                            onSubmit={(values, actions) => {
                              onRegisterSubmit(values);
                              actions.resetForm();
                            }}
                          >
                            <Form>
                              {registerSuccess === false &&
                                registerLoading === false && (
                                  <>
                                    <div className="relative mb-2">
                                      <Field
                                        type="text"
                                        name="name"
                                        className="form-style"
                                        placeholder="Your Full Name"
                                        id="regname"
                                        autoComplete="off"
                                      />
                                      <div>
                                        <TbUser className="input-icon" />
                                      </div>
                                    </div>
                                    <div className="relative mb-2">
                                      <Field
                                        type="email"
                                        name="email"
                                        className="form-style"
                                        placeholder="Your Email"
                                        id="regemail"
                                        autoComplete="off"
                                      />
                                      <div>
                                        <SiMaildotru className="input-icon" />
                                      </div>
                                    </div>
                                    <div className="relative mb-2">
                                      <Field
                                        type="text"
                                        name="password"
                                        className="form-style"
                                        placeholder="Your Password"
                                        id="regpass"
                                        autoComplete="off"
                                      />
                                      <div>
                                        <RiLockPasswordLine className="input-icon" />
                                      </div>
                                    </div>
                                    <div className="relative">
                                      <Field
                                        type="text"
                                        name="confirmPassword"
                                        className="form-style"
                                        placeholder="Confirm Password"
                                        id="regconfirmpass"
                                        autoComplete="off"
                                      />
                                      <div>
                                        <RiLockPasswordLine className="input-icon uil" />
                                      </div>
                                    </div>
                                  </>
                                )}
                              {registerSuccess === false && registerLoading && (
                                <div className="text-Green flex-center-center h-[230px] flex-col uppercase">
                                  <PropagateLoader color="#36d7b7" />
                                </div>
                              )}

                              {registerSuccess && registerLoading === false && (
                                <div className="text-Green flex h-[230px] flex-col items-center uppercase">
                                  <FiCheckCircle size={80} />
                                  <h4 className="text-GreenLight my-6">
                                    Congratulations
                                  </h4>
                                  <p className="text-[#ffeba7]">
                                    Your registration has been successful
                                  </p>
                                  <ModalWindowBackdrop></ModalWindowBackdrop>
                                </div>
                              )}
                              {registerLoading === false &&
                                (registerSuccess ? (
                                  <button
                                    type="button"
                                    className="btn"
                                    onClick={onOkBtnClick}
                                  >
                                    Ok
                                  </button>
                                ) : (
                                  <button type="submit" className="btn mt-4">
                                    submit
                                  </button>
                                ))}
                            </Form>
                          </Formik>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
