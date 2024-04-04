import { useSelector } from "react-redux";
import { Avatar } from "@nextui-org/react";

import UserLayout from "../layout/UserLayout";
import MetaData from "../layout/MetaData";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <MetaData title={`Profile ${user?.user?.name}`} />
      <UserLayout>
        <div className="user-profile__page flex flex-col md:flex-row gap-10">
          {/* User profile Afatar */}
          <div
            className="md:order-2 w-full md:w-[100px]
         hidden md:flex items-center justify-center"
          >
            <Avatar
              src={
                user?.user?.avatar
                  ? user?.avatar?.url
                  : "https://i.pravatar.cc/150?u=a042581f4e29026024d"
              }
              className="w-30 h-30 text-large"
            />
          </div>
          {/* User profile info */}
          <div className="md:order-1">
            <div className="mb-5">
              <h2 className="subHeadingTitle text-default-600">
                Nama Pengguna
              </h2>
              <p className="paragraphDetail">{user?.user?.name}</p>
            </div>
            <div className="mb-5">
              <h2 className="subHeadingTitle text-default-600">Alamat Email</h2>
              <p className="paragraphDetail">{user?.user?.email}</p>
            </div>
            <div className="mb-5">
              <h2 className="subHeadingTitle text-default-600">
                Bergabung Sejak
              </h2>
              <p className="paragraphDetail">
                {user?.user?.createdAt?.substring(0, 10)}
              </p>
            </div>
          </div>
        </div>
      </UserLayout>
    </>
  );
};
export default Profile;
