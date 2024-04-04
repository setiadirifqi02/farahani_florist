import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUpdatePasswordMutation } from "../../redux/api/userApi";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Input, Button } from "@nextui-org/react";
import { toast } from "react-hot-toast";

import UserLayout from "../layout/UserLayout";
import MetaData from "../layout/MetaData";

const UpdatePassword = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [updatePassword, { isLoading, error, isSuccess }] =
    useUpdatePasswordMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Password pengguna telah diupdate");
      navigate("/me/profile");
    }
  }, [error, isSuccess]);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const passwordUpdateData = {
      oldPassword,
      password,
    };

    updatePassword(passwordUpdateData);
  };

  return (
    <>
      <MetaData title={"Update password"} />
      <UserLayout>
        <div className="update-password__page">
          {/* input for update password section */}
          <form
            className="form-login flex  w-full flex-col"
            onSubmit={onSubmitHandler}
          >
            <h2 className="subHeadingTitle text-default-600">Password Lama</h2>
            <Input
              label="Password Lama"
              name="Password Lama"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukan password lama"
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
              className="w-[350px] md:w-[400px] my-3"
            />
            <h2 className="subHeadingTitle text-default-600">Password Baru</h2>
            <Input
              label="New Password"
              name="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukan password baru"
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
              className="w-[350px] md:w-[400px] my-3"
            />
            <div className="flex w-full lg:max-w-md flex-col items-end mt-5">
              <Button
                type="submit"
                color="primary"
                className="text-white w-full md:w-[100px]"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </div>
      </UserLayout>
    </>
  );
};
export default UpdatePassword;
