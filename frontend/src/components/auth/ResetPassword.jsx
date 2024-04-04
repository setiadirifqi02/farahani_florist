import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Input } from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";

import Carousel from "../atoms/Carousel";
import MetaData from "../layout/MetaData";
import { useResetPasswordMutation } from "../../redux/api/userApi";
import { useSelector } from "react-redux";

const ResetPassword = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPasswod] = useState("");

  const [resetPassword, { isLoading, error, isSuccess }] =
    useResetPasswordMutation();

  const navigate = useNavigate();
  const params = useParams();

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Password berhasil diupdate");
      navigate("/login");
    }
  }, [error, isAuthenticated, isSuccess]);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Password tidak sesuai, coba lagi!");
    }

    if (password.length < 6) {
      return toast.error("Password setidaknya 6 karater");
    }

    const userData = {
      password,
      confirmPassword,
    };

    resetPassword({ token: params?.token, body: userData });
  };
  return (
    <>
      <MetaData title="Reset Passwod Account" />
      <div className="reset-passwod___page content flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-6/12 md:pr-10 my-10 text-center md:text-left">
          <h1 className="headingTitle">
            Reset Password Akun
            <br />
            Farhani Florist Shop
          </h1>

          {/* Login Form Section */}
          <form
            className="form-login mt-10 flex flex-col items-start"
            onSubmit={onSubmitHandler}
          >
            <h2 className="subTitle mb-4">Password Baru</h2>
            <Input
              label="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashIcon className="h-4" />
                  ) : (
                    <EyeIcon className="h-4" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="w-[300px] md:w-full lg:max-w-md"
            />
            <h2 className="subTitle mb-4">Konfirmasi Password</h2>
            <Input
              label="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPasswod(e.target.value)}
              placeholder="Enter your confirmation password"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashIcon className="h-4" />
                  ) : (
                    <EyeIcon className="h-4" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="w-[300px] md:w-full lg:max-w-md"
            />

            <div className="flex w-full lg:max-w-md flex-col items-center justify-center mt-5">
              <Button
                type="submit"
                color="primary"
                className="text-white w-full"
                disabled={isLoading}
              >
                {isLoading ? "Mereset Password..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>

        {/* Caraousel Section */}
        <div className="w-full hidden md:block md:w-6/12">
          <Carousel />
        </div>
      </div>
    </>
  );
};
export default ResetPassword;
