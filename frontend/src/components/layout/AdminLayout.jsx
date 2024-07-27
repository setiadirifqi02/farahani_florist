import { useState } from "react";
import { Link as routerLink, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";

import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

import { adminSettingMenu } from "../../constants/constants";

import Sidebar from "../atoms/Sidebar";
import AdminSideBar from "../atoms/AdminSideBar";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [activeMenuItem, setMenuItem] = useState(location.pathname);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="admin___layout p-4 md:content flex flex-col   w-full md:min-w-[800px] ">
      <h1 className="headingTitle text-default-600 text-center">
        Menu Admin Dashboard
      </h1>
      <div className="admin-info__layout flex w-full items-center  gap-4 md:p-5 mt-10 mb-5">
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
            Kelola dan Update toko
          </h2>
          <p className="paragraphDetail text-green-500">
            {/* {user?.user?.name} */}
            admin
          </p>
        </div>
      </div>
      <div className="admin-main___layout flex w-full flex-col md:flex-row">
        <div className="side-bar__container md:w-3/12 mb-5">
          <div className="hidden md:block sticky top-28">
            <AdminSideBar />
          </div>
          <div className="block md:hidden mb-4">
            <Select
              items="Admin  Setting"
              label="Admin Setting"
              className="w-[350px]"
              placeholder={`${
                activeMenuItem.includes("/admin")
                  ? `${activeMenuItem.replace("/admin/", "").replace("_", " ")}`
                  : "Admin Setting"
              }`}
            >
              {adminSettingMenu.map((item) => (
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
        <div className="admin-content__container w-full md:w-9/12 flex">
          {children}
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
