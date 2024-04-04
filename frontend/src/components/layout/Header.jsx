import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@nextui-org/react";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import SearchBar from "../atoms/SearchBar";

import { useState } from "react";
import { Link as routerLink, useLocation, useNavigate } from "react-router-dom";

import { navMenuItem } from "../../constants/constants";

import { useGetMeQuery } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import { useLazyLogoutQuery } from "../../redux/api/authApi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const path = useLocation();

  const { isLoading } = useGetMeQuery();
  const [logout, { data }] = useLazyLogoutQuery();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const logOutHandler = () => {
    logout();
    navigate(0);
  };

  // console.log(data);
  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      className="p-2 md:p-4 font-poppins"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarItem>
          <NavbarBrand as={routerLink} to="/">
            <img
              src="/icons/logo.png"
              alt="Farhani florist's logo"
              className="h-12 w-8 object-cover md:cursor-pointer ml-28 md:ml-[5px]"
            />
          </NavbarBrand>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navMenuItem.map((item) => (
          <NavbarItem
            key={item.label}
            isActive={path.pathname === `${item.link}`}
          >
            <Link
              color={
                path.pathname === `${item.link}` ? "primary" : "foreground"
              }
              as={routerLink}
              to={item.link}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent as="div" className="gap-1 ml-24" justify="end">
        <NavbarItem className="hidden lg:flex">
          <SearchBar />
        </NavbarItem>
        {user ? (
          <NavbarItem>
            <div className="relative flex mr-[-20px]">
              <span className="absolute right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-400 text-white z-50">
                {cartItems?.length}
              </span>
              <Button as={routerLink} to="/cart" variant="light" size="sm">
                <ShoppingBagIcon className="w-8 h-8 p-2 rounded-full bg-green-500 text-white" />
              </Button>
            </div>
          </NavbarItem>
        ) : null}

        {user ? (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light">
                <Avatar
                  isBordered
                  size="sm"
                  color="primary"
                  src={
                    user?.user?.avatar
                      ? user?.user?.avatar?.url
                      : "https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  }
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                aria-label="profile-info"
              >
                <p className="font-semibold">
                  Signed in
                  <span className="capitalize text-green-500">
                    {" "}
                    {user?.user?.name}
                  </span>
                </p>
                <p className="font-semibold">{user?.user?.email}</p>
              </DropdownItem>
              {user?.user?.role === "admin" && (
                <DropdownItem
                  key="dashboard"
                  as={routerLink}
                  to="/admin/dashboard"
                  aria-label="dashboard"
                >
                  Dasboard
                </DropdownItem>
              )}

              <DropdownItem
                key="orders"
                as={routerLink}
                to="/me/orders"
                aria-label="orders"
              >
                Orders
              </DropdownItem>
              <DropdownItem
                key="profileMe"
                as={routerLink}
                to="/me/profile"
                aria-label="profile"
              >
                Profile
              </DropdownItem>
              <DropdownItem
                key="logout"
                as={routerLink}
                to="/"
                className="text-danger"
                color="danger"
                aria-label="logout"
                onClick={logOutHandler}
              >
                logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          !isLoading && (
            <NavbarItem>
              <Button
                color="primary"
                className="text-white"
                as={routerLink}
                to="/login"
              >
                Login
              </Button>
            </NavbarItem>
          )
        )}
      </NavbarContent>
      <NavbarMenu>
        {navMenuItem.map((item) => (
          <NavbarItem
            key={item.label}
            isActive={path.pathname === `${item.link}`}
          >
            <Link
              color={
                path.pathname === `${item.link}` ? "primary" : "foreground"
              }
              as={routerLink}
              to={item.link}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
