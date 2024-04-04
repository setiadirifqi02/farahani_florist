import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUploadAvatarMutation } from "../../redux/api/userApi";
import { useSelector } from "react-redux";

import { Avatar, Button, Input } from "@nextui-org/react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";

import UserLayout from "../layout/UserLayout";
import MetaData from "../layout/MetaData";

const UploadAvatar = () => {
  const { user } = useSelector((state) => state.auth);

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    user?.user?.avatar
      ? user?.user?.avatar.url
      : "https://i.pravatar.cc/150?u=a04258114e29026302d"
  );

  const navigate = useNavigate();
  const [uploadAvatar, { isLoading, error, isSuccess }] =
    useUploadAvatarMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Avatar profile telah diupdate");
      navigate("/me/profile");
    }
  }, [error, isSuccess]);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const avatarData = {
      avatar,
    };

    console.log(avatarData);

    uploadAvatar(avatarData);
  };

  const onChangeAvatarHandler = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
      <MetaData title={"Upload Avatar"} />
      <UserLayout>
        <div className="upload-avatar__page">
          <div className="flex items-center justify-center my-5">
            <Avatar src={avatarPreview} className="w-20 h-20 text-large" />
          </div>
          {/* Input file avatar section */}
          <form
            className="form-login flex  w-full flex-col"
            onSubmit={onSubmitHandler}
          >
            <h2 className="subHeadingTitle text-default-600">Upload Avatar</h2>
            <Input
              label=" "
              name="Pilih Avatar"
              // value={name}
              onChange={onChangeAvatarHandler}
              endContent={<PhotoIcon className="h-4 text-green-600" />}
              type="file"
              accept="images/*"
              className="w-[350px] md:w-[400px] my-3"
            />
            <div className="flex w-full lg:max-w-md flex-col items-end mt-5">
              <Button
                type="submit"
                color="primary"
                className="text-white w-full md:w-[100px]"
                disabled={isLoading}
              >
                {isLoading ? "Mengunggah..." : "Unggah"}
              </Button>
            </div>
          </form>
        </div>
      </UserLayout>
    </>
  );
};
export default UploadAvatar;
