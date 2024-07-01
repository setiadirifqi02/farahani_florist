import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Input, Button, Spinner } from "@nextui-org/react";
import { toast } from "react-hot-toast";

import Carousel from "../atoms/Carousel";
import MetaData from "../layout/MetaData";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRegisterMutation } from "../../redux/api/authApi";
import { useSelector } from "react-redux";

const Register = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [register, { isLoading, error, data }] = useRegisterMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  //   console.log(data);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error, isAuthenticated]);

  if (isLoading) return <Spinner color="primary" />;

  const onChangeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const signUpData = {
      name,
      email,
      password,
    };

    register(signUpData);
  };
  return (
    <>
      <MetaData title={"Register"} />
      <div className="register___page content flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-6/12 md:pr-10 my-10 text-center md:text-left">
          <h1 className="headingTitle">
            Daftar Akun
            <br />
            Farhani Florist Shop
          </h1>

          {/* Register form section */}
          <form
            className="form-login mt-10 flex flex-col items-start"
            onSubmit={onSubmitHandler}
          >
            <h2 className="subTitle mb-4">Nama Pengguna</h2>
            <Input
              type="text"
              label="Nama Pengguna"
              name="name"
              value={name}
              onChange={onChangeHandler}
              // errorMessage={"Alamat email tidak valid"}
              placeholder="Enter your email"
              className="w-[300px] md:w-full lg:max-w-md"
              endContent={<UserIcon className="h-4" />}
            />
            <h2 className="subTitle mb-4">Email</h2>
            <Input
              type="email"
              label="Email"
              name="email"
              value={email}
              onChange={onChangeHandler}
              // errorMessage={"Alamat email tidak valid"}
              placeholder="Enter your email"
              className="w-[300px] md:w-full lg:max-w-md"
              endContent={<EnvelopeIcon className="h-4" />}
            />
            <div className="flex w-full lg:max-w-md justify-between items-center">
              <h2 className="subTitle mb-4">Password</h2>
              <p className="text-xs font-poppins">Lupa password?</p>
            </div>
            <Input
              label="Password"
              name="password"
              value={password}
              onChange={onChangeHandler}
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
                {isLoading ? "Register akun..." : "Register"}
              </Button>
            </div>
          </form>
        </div>
        <div className="w-full hidden md:block md:w-6/12">
          <Carousel />
        </div>
      </div>
    </>
  );
};
export default Register;
