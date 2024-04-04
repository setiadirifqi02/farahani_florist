import { Link as routerLink, useLocation } from "react-router-dom";

import { Listbox, ListboxItem } from "@nextui-org/react";
import { ListboxWrapper } from "./ListboxWrapper";
import {
  UserIcon,
  UserCircleIcon,
  LockClosedIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [activeMenuItem, setMenuItem] = useState(location.pathname);
  return (
    <ListboxWrapper className="side-bar">
      <Listbox variant="faded" aria-label="Listbox menu with icons">
        <ListboxItem
          key="profile"
          as={routerLink}
          to="/me/profile"
          className={`${
            activeMenuItem.includes("/me/profile") ? "bg-gray-200" : ""
          }`}
          startContent={<UserIcon className="h-5 text-green-500" />}
          endContent={<ChevronRightIcon className="h-5 text-green-500" />}
        >
          Profile
        </ListboxItem>
        <ListboxItem
          key="update-profile"
          as={routerLink}
          to="/me/update_profile"
          className={`${
            activeMenuItem.includes("/me/update_profile") ? "bg-gray-200" : ""
          }`}
          startContent={<UserIcon className="h-5 text-green-500" />}
          endContent={<ChevronRightIcon className="h-5 text-green-500" />}
        >
          Update Profile
        </ListboxItem>
        <ListboxItem
          key="upload-avatar"
          as={routerLink}
          to="/me/upload_avatar"
          className={`${
            activeMenuItem.includes("/me/upload_avatar") ? "bg-gray-200" : ""
          }`}
          startContent={<UserCircleIcon className="h-5 text-green-500" />}
          endContent={<ChevronRightIcon className="h-5 text-green-500" />}
        >
          Upload Avatar
        </ListboxItem>
        <ListboxItem
          key="update-password"
          as={routerLink}
          to="/me/update_password"
          className={`${
            activeMenuItem.includes("/me/update_password") ? "bg-gray-200" : ""
          }`}
          startContent={<LockClosedIcon className="h-5 text-green-500" />}
          endContent={<ChevronRightIcon className="h-5 text-green-500" />}
        >
          Update Password
        </ListboxItem>
      </Listbox>
    </ListboxWrapper>
  );
};
export default Sidebar;
