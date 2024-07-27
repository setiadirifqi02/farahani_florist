import { useEffect } from "react";
import { Link as routerLink, useLocation } from "react-router-dom";

import { toast } from "react-hot-toast";
import { Spinner, Tab, Tabs } from "@nextui-org/react";

import MetaData from "../layout/MetaData";
import TopProductsItem from "./TopProductsItem";

import { useGetTopProductsQuery } from "../../redux/api/productsApi";

const TopProduct = () => {
  const { pathname } = useLocation();

  const { data, isLoading, isError, error } = useGetTopProductsQuery();

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  });

  if (isLoading) return <Spinner color="primary" />;
  return (
    <>
      <MetaData title="Top Product" />
      <div className="top-product__page content">
        {/* Product List Section */}
        <div className="product___container flexCenter  flex-col mt-5 lg:mt-10">
          <h1 className="headingTitle capitalize text-center w-[400px]">
            Tanaman Hias Terlaris
          </h1>

          <p className="font-poppins py-4 text-center w-[400px]">
            Menampilkan koleksi terlaris tanaman hias di Farhani Floist Shop
            <span className="font-semibold text-green-500">
              {/* {data?.products?.length} */}
            </span>
          </p>
          <div
            className="filter flex flex-row justify-between
           w-full items-start px-6 md:p-5"
          >
            <Tabs
              variant="underlined"
              selectedKey={pathname}
              arial-label="tabs of product"
              className="font-poppins font-semibold text-lg"
            >
              <Tab
                id="/all_products"
                title="Semua Produk"
                as={routerLink}
                to={"/all_products"}
                className={
                  pathname === "/all_products"
                    ? "border-b-3 border-green-500"
                    : ""
                }
              />
              <Tab
                id="/top_products"
                title="Produk Terlaris"
                as={routerLink}
                to={"/top_products"}
                className={
                  pathname === "/top_products"
                    ? "border-b-3 border-green-500"
                    : ""
                }
              />
            </Tabs>
            <div></div>
          </div>
          <div className="grid grid-cols-2 px-2 lg:grid-cols-4">
            {data?.topProducts?.map((product) => (
              <TopProductsItem key={product?.productId} products={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default TopProduct;
