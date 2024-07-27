import { useEffect, useState } from "react";
import { Link as routerLink, useNavigate } from "react-router-dom";

import { Button, Input, Link, Spinner } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { EyeIcon, EyeSlashIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

import Carousel from "../atoms/Carousel";
import MetaData from "../layout/MetaData";
import { useLoginMutation } from "../../redux/api/authApi";
import { useSelector } from "react-redux";

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading, error, data, isSuccess }] = useLoginMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  // console.log(data);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error, isAuthenticated]);

  if (isLoading) return <Spinner color="primary" />;

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    login(loginData);
  };

  return (
    <>
      <MetaData title="Login Akun" />
      <div className="login___page content flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-6/12 md:pr-10 my-10 text-center md:text-left">
          <h1 className="headingTitle">
            Masuk Akun
            <br />
            Farhani Florist Shop
          </h1>

          {/* Login Form Section */}
          <form
            className="form-login mt-10 flex flex-col items-start"
            onSubmit={onSubmitHandler}
          >
            <h2 className="subTitle mb-4">Email</h2>
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // errorMessage={"Alamat email tidak valid"}
              placeholder="Enter your email"
              className="w-[300px] md:w-full lg:max-w-md"
              endContent={<EnvelopeIcon className="h-4" />}
            />
            <div className="flex w-full lg:max-w-md justify-between items-center">
              <h2 className="subTitle mb-4">Password</h2>
              <Link
                as={routerLink}
                to="/password/forgot"
                className="text-xs font-poppins"
              >
                Lupa password?
              </Link>
            </div>
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

            <div className="flex w-full lg:max-w-md flex-col items-center justify-center mt-5">
              <Button
                type="submit"
                color="primary"
                className="text-white w-full"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Masuk"}
              </Button>
              <div className="flex text-xs font-poppins mt-5 gap-1">
                <p>Belum punya Akun?</p>
                <Link as={routerLink} to="/register" className="text-xs">
                  Daftar?
                </Link>
              </div>
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
export default Login;
