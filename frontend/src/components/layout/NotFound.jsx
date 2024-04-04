import { HomeIcon } from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/react";
import { Link as routerLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found__page content">
      <div className="mt-20">
        <img
          src="/images/404-not-found.webp"
          alt="404"
          className="w-80 md:w-72"
        />
        <div className="mt-5 text-center">
          <div className="mb-10 font-light text-gray-600 md:mb-16">
            <h1 className="headingTitle">Oops!</h1>
            <p className="font-poppins text-default-500">
              Halaman tidak ditemukan.
            </p>
            <p className="mb-5 font-poppins text-default-500">
              coba lagi atau klik tombol home
            </p>
            <Button
              color="primary"
              className="text-white font-poppins"
              as={routerLink}
              to={"/"}
              startContent={<HomeIcon className="h-4 text-white" />}
            >
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NotFound;
