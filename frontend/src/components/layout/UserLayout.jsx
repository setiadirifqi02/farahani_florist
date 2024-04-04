import { useState } from "react";
import { Link as routerLink, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";

import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

import { profileSettingMenu } from "../../constants/constants";

import Sidebar from "../atoms/Sidebar";

const UserLayout = ({ children }) => {
  const location = useLocation();
  const [activeMenuItem, setMenuItem] = useState(location.pathname);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="user___layout p-10 md:content flex flex-col  w-full md:min-w-[800px] lg:max-w-[800px]">
      <h1 className="headingTitle text-default-600 text-center">
        User Setting
      </h1>
      <div className="user-info__layout flex w-full items-center  gap-4 md:p-5 mt-10 mb-5">
        <Avatar
          isBordered
          color="primary"
          src={
            user?.user?.avatar
              ? user?.user?.avatar?.url
              : "https://i.pravatar.cc/150?u=a042581f4e29026024d"
          }
        />
        <div className="flex flex-col">
          <h2 className="text-sm lg:text-lg font-poppins text-default-600 font-bold">
            Manage dan Update Akunmu
          </h2>
          <p className="paragraphDetail text-green-500">{user?.user?.name}</p>
        </div>
      </div>
      <div className="user-main___layout flex w-full flex-col md:flex-row">
        <div className="side-bar__container md:w-2/6 mb-5">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <div className="block md:hidden mb-4">
            <Select
              items="User Setting"
              label="User Setting"
              className="w-[350px]"
              placeholder={`${
                activeMenuItem.includes("/me")
                  ? `${activeMenuItem.replace("/me/", "").replace("_", " ")}`
                  : "User Setting"
              }`}
            >
              {profileSettingMenu.map((item) => (
                <SelectItem
                  key={item.label}
                  as={routerLink}
                  to={`${item.link}`}
                  endContent={
                    <ChevronRightIcon className="h-4 text-green-500" />
                  }
                >
                  {item.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="user-content__container w-full md:w-4/6 md:ml-10  flex">
          {children}
        </div>
      </div>
    </div>
  );
};
export default UserLayout;
