import { categoryOfPlants } from "../constants/constants";
import { Button, Spinner } from "@nextui-org/react";

import { toast } from "react-hot-toast";

import CardCategories from "./atoms/CardCompOne";
import Carousel from "./atoms/Carousel";
import SearchBar from "./atoms/SearchBar";
import Filter from "./atoms/Filter";

import MetaData from "./layout/MetaData";

import ProductsItem from "./products/ProductsItem";

import { useGetProductsQuery } from "../redux/api/productsApi";
import { useEffect } from "react";
import { Link as routerLink } from "react-router-dom";

import CustomPagination from "./atoms/Pagination";
import { useSearchParams } from "react-router-dom";

const Home = () => {
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
      <MetaData title="Home" />
      <div className="home___page">
        <div className="search-bar__container  flexCenter lg:hidden ">
          <SearchBar />
        </div>

        {/* Hero Section */}
        <div
          className={
            keyword
              ? "hidden"
              : "hero__container flexCenter flex-col md:flex-row"
          }
        >
          <div className="w-full md:w-6/12 order-last md:order-first px-4 md:pl-10 md:pr-10 my-10 text-center md:text-left">
            <h1 className="headingTitle">Farhani Florist Shop</h1>
            <p className="paragraph py-4">
              Temukan tanaman hias cantik untuk menghiasi ruangan Anda. Hadirkan
              keindahan alam dalam potongan kecil di rumah Anda.
            </p>

            <Button
              as={routerLink}
              to={"/all_products"}
              radius="full"
              color="primary"
              className="text-white my-10 font-poppins"
            >
              Lihat Produk
            </Button>
          </div>
          <div className="w-full px-6 md:w-6/12">
            <Carousel />
          </div>
        </div>

        {/* Feature Section */}
        <div
          className={
            keyword
              ? "hidden"
              : "feature__container flexCenter flex-col mt-5 lg:mt-10 bg-gray-50 py-5 rounded-lg"
          }
        >
          <h1 className="headingTitle">Kategori Produk</h1>
          <p className="font-poppins py-4 text-center w-[400px]">
            Koleksi tanaman hias kami dengan berbagai kategori bisa kamu lihat
            disini
          </p>
          <div className="flex flex-col p-3 justify-center  md:flex-row gap-5 flex-wrap">
            {categoryOfPlants.map((item) => (
              <CardCategories
                key={item.title}
                title={item.title}
                desc={item.desc}
                imagUrl={item.imageUrl}
                url={item?.url}
              />
            ))}
          </div>
        </div>

        {/* Product Section */}
        <div className="product___container flexCenter flex-col mt-5 lg:mt-10">
          <h1 className="headingTitle capitalize text-center w-[400px]">
            {keyword
              ? `Hasil pencarian: ${keyword} 
              ditemukan ${data?.products?.length} tanaman `
              : "Produk Terbaru"}
          </h1>

          <p
            className={
              keyword
                ? "hidden"
                : "font-poppins py-4 px-4 text-center w-[400px]"
            }
          >
            Menampilkan semua koleksi tanaman hias kami dengan berbagai macam
            dan jenis{" "}
          </p>
          <div
            className={
              keyword
                ? "filter flex flex-row justify-between w-full items-center p-3 md:p-5"
                : "hidden"
            }
          >
            <h2 className="subHeadingTitle">Filter</h2>
            <Filter />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 px-2">
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
export default Home;
