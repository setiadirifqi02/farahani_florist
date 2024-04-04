import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useGetProductsQuery } from "../../redux/api/productsApi";
import { toast } from "react-hot-toast";

import { Spinner } from "@nextui-org/react";

import Filter from "../atoms/Filter";
import SearchBar from "../atoms/SearchBar";
import CustomPagination from "../atoms/Pagination";

import ProductsItem from "./ProductsItem";
import MetaData from "../layout/MetaData";

const AllProduct = () => {
  let [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const minPrice = searchParams.get("min");
  const maxPrice = searchParams.get("max");
  const category = searchParams.get("category");
  const ratings = searchParams.get("ratings");

  const params = { page, keyword };

  minPrice !== null && (params.min = minPrice);
  maxPrice !== null && (params.max = maxPrice);
  category !== null && (params.category = category);
  ratings !== null && (params.ratings = ratings);
  // console.log(params);

  const { data, isLoading, error, isError } = useGetProductsQuery(params);

  // console.log(data);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  });

  if (isLoading) return <Spinner color="primary" />;
  return (
    <>
      <MetaData title="All Product" />
      <div className="all-product__page content">
        <div className="search-bar__container  flexCenter lg:hidden ">
          <SearchBar />
        </div>
        {/* Product List Section */}
        <div className="product___container flexCenter flex-col mt-5 lg:mt-10">
          <h1 className="headingTitle capitalize text-center w-[400px]">
            {keyword
              ? `Hasil pencarian: ${keyword} 
        ditemukan ${data?.products?.length} tanaman `
              : "Semua Tanaman"}
          </h1>

          <p
            className={
              keyword ? "hidden" : "font-poppins py-4 text-center w-[400px]"
            }
          >
            Menapilkan seluruh koleksi tanaman {category} yang tersedia di
            Farhani Floist Shop ditemukan{" "}
            <span className="font-semibold text-green-500">
              {data?.products?.length}
            </span>
          </p>
          <div
            className="filter flex flex-row justify-between
           w-full items-center p-3 md:p-5"
          >
            <h2 className="subHeadingTitle">Semua Produk </h2>
            <Filter />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {data?.products?.map((product) => (
              <ProductsItem key={product?._id} products={product} />
            ))}
          </div>
          <div className="flex mt-5  mb-10">
            <CustomPagination
              restPerPage={data?.restPerPage}
              filteredProductsCount={data?.filteredProductsCount}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default AllProduct;
