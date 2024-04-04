import { Link as routerLink, useLocation } from "react-router-dom";

import { Listbox, ListboxItem } from "@nextui-org/react";
import { ListboxWrapper } from "./ListboxWrapper";
import {
  UserIcon,
  UserCircleIcon,
  LockClosedIcon,
  ChevronRightIcon,
  ComputerDesktopIcon,
  PlusCircleIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  InboxStackIcon,
  QueueListIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

const AdminSideBar = () => {
  const location = useLocation();
  const [activeMenuItem, setMenuItem] = useState(location.pathname);
  return (
    <ListboxWrapper className="side-bar">
      <Listbox variant="faded" aria-label="Listbox menu with icons">
        <ListboxItem
          key="dashboard"
          as={routerLink}
          to="/admin/dashboard"
          className={`${
            activeMenuItem.includes("/admin/dashboard") ? "bg-gray-200" : ""
          }`}
          startContent={<ComputerDesktopIcon className="h-5 text-green-500" />}
          endContent={<ChevronRightIcon className="h-5 text-green-500" />}
        >
          Dashboard
        </ListboxItem>
        <ListboxItem
          key="new-product"
          as={routerLink}
          to="/admin/product/new"
          className={`${
            activeMenuItem.includes("/admin/product/new") ? "bg-gray-200" : ""
          }`}
          startContent={<PlusCircleIcon className="h-5 text-green-500" />}
          endContent={<ChevronRightIcon className="h-5 text-green-500" />}
        >
          Produk Baru
        </ListboxItem>
        <ListboxItem
          key="products"
          as={routerLink}
          to="/admin/products"
          className={`${
            activeMenuItem.includes("/admin/products") ? "bg-gray-200" : ""
          }`}
          startContent={<InboxStackIcon className="h-5 text-green-500" />}
          endContent={<ChevronRightIcon className="h-5 text-green-500" />}
        >
          Produk
        </ListboxItem>
        <ListboxItem
          key="orders"
          as={routerLink}
          to="/admin/orders"
          className={`${
            activeMenuItem.includes("/admin/orders") ? "bg-gray-200" : ""
          }`}
          startContent={<QueueListIcon className="h-5 text-green-500" />}
          endContent={<ChevronRightIcon className="h-5 text-green-500" />}
        >
          Pesanan
        </ListboxItem>
        <ListboxItem
          key="user"
          as={routerLink}
          to="/admin/users"
          className={`${
            activeMenuItem.includes("/admin/users") ? "bg-gray-200" : ""
          }`}
          startContent={<UserGroupIcon className="h-5 text-green-500" />}
          endContent={<ChevronRightIcon className="h-5 text-green-500" />}
        >
          Pengguna
        </ListboxItem>
        <ListboxItem
          key="reviews"
          as={routerLink}
          to="/admin/reviews"
          className={`${
            activeMenuItem.includes("/admin/reviews") ? "bg-gray-200" : ""
          }`}
          startContent={
            <ChatBubbleLeftRightIcon className="h-5 text-green-500" />
          }
          endContent={<ChevronRightIcon className="h-5 text-green-500" />}
        >
          Ulasan
        </ListboxItem>
      </Listbox>
    </ListboxWrapper>
  );
};
export default AdminSideBar;
