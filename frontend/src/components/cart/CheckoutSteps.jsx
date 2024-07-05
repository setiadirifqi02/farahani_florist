import { Link as routerLink } from "react-router-dom";
import { Link } from "@nextui-org/react";
import {
  TruckIcon,
  WalletIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  return (
    <div className="ml-10 md:ml-24 flex items-center justify-center checkout-steps my-5 md:mb-10">
      <ul className="relative w-[300px] md:w-[500px] flex flex-row gap-x-2">
        {shipping ? (
          <li className="shrink basis-0 flex-1 group">
            <div className="min-w-7 min-h-7 w-full inline-flex items-center text-xs align-middle">
              <span className="size-7 flex justify-center items-center flex-shrink-0 bg-green-500 font-medium text-white rounded-full dark:bg-gray-700 dark:text-white">
                <Link as={routerLink} to="/shipping">
                  <TruckIcon className="h-4 text-white " />
                </Link>
              </span>
              <div className="ms-2 w-full h-px flex-1 bg-green-500 group-last:hidden dark:bg-gray-700"></div>
            </div>
            <div className="mt-3">
              <span className="block text-sm font-medium text-gray-800 dark:text-white">
                Pengiriman
              </span>
            </div>
          </li>
        ) : (
          <li className="shrink basis-0 flex-1 group">
            <div className="min-w-7 min-h-7 w-full inline-flex items-center text-xs align-middle">
              <span className="size-7 flex justify-center items-center flex-shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full dark:bg-gray-700 dark:text-white">
                1
              </span>
              <div className="ms-2 w-full h-px flex-1 bg-gray-200 group-last:hidden dark:bg-gray-700"></div>
            </div>
            <div className="mt-3">
              <span className="block text-sm font-medium text-gray-800 dark:text-white">
                Pengiriman
              </span>
            </div>
          </li>
        )}

        {confirmOrder ? (
          <li className="shrink basis-0 flex-1 group">
            <div className="min-w-7 min-h-7 w-full inline-flex items-center text-xs align-middle">
              <span className="size-7 flex justify-center items-center flex-shrink-0 bg-green-500 font-medium text-white rounded-full dark:bg-gray-700 dark:text-white">
                <Link as={routerLink} to="/confirm_order">
                  <CheckBadgeIcon className="h-4 text-white " />
                </Link>
              </span>
              <div className="ms-2 w-full h-px flex-1 bg-green-500 group-last:hidden dark:bg-gray-700"></div>
            </div>
            <div className="mt-3">
              <span className="block text-sm font-medium text-gray-800 dark:text-white">
                Konfirmasi Pembelian
              </span>
            </div>
          </li>
        ) : (
          <li className="shrink basis-0 flex-1 group">
            <div className="min-w-7 min-h-7 w-full inline-flex items-center text-xs align-middle">
              <span className="size-7 flex justify-center items-center flex-shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full dark:bg-gray-700 dark:text-white">
                2
              </span>
              <div className="ms-2 w-full h-px flex-1 bg-gray-200 group-last:hidden dark:bg-gray-700"></div>
            </div>
            <div className="mt-3">
              <span className="block text-sm font-medium text-gray-800 dark:text-white">
                Konfirmasi Pembelian
              </span>
            </div>
          </li>
        )}

        {payment ? (
          <li className="shrink basis-0 flex-1 group">
            <div className="min-w-7 min-h-7 w-full inline-flex items-center text-xs align-middle">
              <span className="size-7 flex justify-center items-center flex-shrink-0 bg-green-500 font-medium text-white rounded-full dark:bg-gray-700 dark:text-white">
                <Link as={routerLink} to="/payment">
                  <WalletIcon className="h-4 text-white " />
                </Link>
              </span>
              <div className="ms-2 w-full h-px flex-1 bg-green-500 group-last:hidden dark:bg-gray-700"></div>
            </div>
            <div className="mt-3">
              <span className="block text-sm font-medium text-gray-800 dark:text-white">
                Pembayaran
              </span>
            </div>
          </li>
        ) : (
          <li className="shrink basis-0 flex-1 group">
            <div className="min-w-7 min-h-7 w-full inline-flex items-center text-xs align-middle">
              <span className="size-7 flex justify-center items-center flex-shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full dark:bg-gray-700 dark:text-white">
                3
              </span>
              <div className="ms-2 w-full h-px flex-1 bg-gray-200 group-last:hidden dark:bg-gray-700"></div>
            </div>
            <div className="mt-3">
              <span className="block text-sm font-medium text-gray-800 dark:text-white">
                Pembayaran
              </span>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};
export default CheckoutSteps;
