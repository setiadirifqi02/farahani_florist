import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input, Spinner, Button } from "@nextui-org/react";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";

import MetaData from "../layout/MetaData";

import { useForgotPasswordMutation } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import Carousel from "../atoms/Carousel";

const ForgotPassword = () => {
  const [email, setEmail] = useState();

  const navigate = useNavigate();

  const [forgotPassword, { isLoading, error, isSuccess }] =
    useForgotPasswordMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Email terkirim. Periksa kotak masuk");
    }
  }, [error, isAuthenticated, isSuccess]);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    forgotPassword({ email });
  };

  return (
    <>
      <MetaData title="Forgot Password Akun" />
      <div className="forgot-password__page content flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-6/12 md:pr-10 my-10 text-center md:text-left">
          <h1 className="headingTitle">
            Lupa Password Akun
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
              placeholder="Enter your email"
              className="w-[300px] md:w-full lg:max-w-md"
              endContent={<EnvelopeIcon className="h-4" />}
            />

            <div className="flex w-full lg:max-w-md flex-col items-center justify-center mt-5">
              <Button
                type="submit"
                color="primary"
                className="text-white w-full"
                disabled={isLoading}
              >
                {isLoading ? "Mengirim..." : "Submit"}
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

export default ForgotPassword;
