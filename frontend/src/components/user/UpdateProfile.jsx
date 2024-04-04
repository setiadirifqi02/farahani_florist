import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUpdateUserProfileMutation } from "../../redux/api/userApi";
import { useSelector } from "react-redux";

import { Button, Input } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/solid";

import UserLayout from "../layout/UserLayout";
import MetaData from "../layout/MetaData";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading, error, isSuccess }] =
    useUpdateUserProfileMutation();

  useEffect(() => {
    if (user) {
      setName(user.user.name);
      setEmail(user.user.email);
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Profile pengguna telah diupdate");
      navigate("/me/profile");
    }
  }, [user, error, isSuccess]);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const profileUpdateData = {
      name,
      email,
    };

    updateProfile(profileUpdateData);
  };

  return (
    <>
      <MetaData title={"Update profile"} />
      <UserLayout>
        <div className="user-update___page">
          {/* Input update profile section */}
          <form
            className="form-login flex  w-full flex-col"
            onSubmit={onSubmitHandler}
          >
            <h2 className="subHeadingTitle text-default-600">Nama Pengguna</h2>
            <Input
              label="Nama Pengguna"
              name="nama_pengguna"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukan nama pengguna"
              endContent={<UserIcon className="h-4 text-green-600" />}
              type="text"
              className="w-[350px] md:w-[400px] my-3"
            />
            <h2 className="subHeadingTitle text-default-600">Email</h2>
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="masukan nama email"
              className="w-[350px] md:w-[400px] my-3"
              endContent={<EnvelopeIcon className="h-4 text-green-500" />}
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
export default UpdateProfile;
