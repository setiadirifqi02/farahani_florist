import {
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";

import StarRatings from "react-star-ratings";
import { toast } from "react-hot-toast";

import { Button, Input, Spinner } from "@nextui-org/react";
import { useGetProductsDetailsQuery } from "../../redux/api/productsApi";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import MetaData from "../layout/MetaData";
import NotFound from "../layout/NotFound";

import NewReview from "../review/NewReview";
import ListReviews from "../review/ListReviews";

import { useDispatch, useSelector } from "react-redux";
import { setCartItem } from "../../redux/features/cartSlice";

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const { data, isLoading, error, isError } = useGetProductsDetailsQuery(
    params?.id
  );

  const product = data?.product;
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [activeImg, setActiveImg] = useState("");

  useEffect(() => {
    setActiveImg(
      product?.images[0] ? product?.images[0]?.url : "/images/daun.jpg"
    );
  }, [product]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  });

  const increaseQtyHandler = () => {
    if (quantity >= product.stock) return;

    setQuantity((prev) => prev + 1);
  };

  const decreaseQtyHandler = () => {
    if (quantity <= 1) return;

    setQuantity((prev) => prev - 1);
  };

  const changeQuantityHandler = (event) => {
    const itemValue =
      parseInt(event.target.value) > 0 ? parseInt(event.target.value) : 1;
    setQuantity(itemValue);
  };

  const setItemToCart = () => {
    const cartItem = {
      product: product?._id,
      name: product?.name,
      color: product?.color,
      price: product?.price,
      image: product?.images[0]?.url,
      stock: product?.stock,
      quantity,
    };

    dispatch(setCartItem(cartItem));
    toast.success("Produk ditambahkan ke keranjang");
  };

  if (isLoading) return <Spinner color="primary" />;

  if (error && error?.status === 404) {
    return <NotFound />;
  }

  return (
    <>
      <MetaData title={`${product?.name}`} />
      <div className="product-detail__page content py-3 flex flex-col md:flex-row md:gap-2">
        {/* Product images section*/}
        <div className="product-image w-full md:w-5/12 md:p-10">
          <img
            src={activeImg}
            alt={product?.name}
            className="rounded-xl mb-5"
          />
          <div className="grid grid-cols-3 gap-5">
            {product?.images?.map((img, i) => (
              <img
                key={i}
                src={img?.url}
                alt={img?.url}
                className={`${
                  img.url === activeImg
                    ? "border-2 rounded-xl border-green-500"
                    : ""
                } `}
                onClick={(e) => setActiveImg(img?.url)}
              />
            ))}
          </div>
        </div>
        <div className="product-container  w-full md:w-7/12 h-full flex flex-col py-5 md:p-5">
          {/* Product info section */}
          <div className="product-info flex flex-col rounded-xl shadow-md w-full p-5 ">
            <small className="font-poppins font-bold text-default-500">
              Kategori {product?.category}
            </small>
            <div className="flex flex-row justify-between">
              <h2 className="headingTitle text-green-500 font-lora">
                {product?.name}
              </h2>
              <h2
                className={`subHeadingTitle font-poppins ${
                  product?.stock > 0 ? "text-gray-500" : "text-red-400"
                }`}
              >
                {product?.stock > 0 ? "In Stock" : "Out of Stock"}
              </h2>
            </div>
            <div className="flex mt-[-18px] py-2 items-end">
              <StarRatings
                rating={product?.ratings}
                starRatedColor="#eab308"
                numberOfStars={5}
                name="rating"
                starDimension="25px"
                starSpacing="2px"
              />
              <p className="font-poppins text-xs ml-2">
                ( {product?.numOfReviews} Ulasan)
              </p>
            </div>
            <h2 className="subTitle">Warna</h2>
            <p className="paragraphDetail">{product?.color}</p>
            <h2 className="subTitle">Deskripsi</h2>
            <p className="paragraphDetail">{product?.description}</p>
            <h2 className="subTitle">Harga</h2>
            <h2 className="subHeadingTitle text-green-500 font-lora">
              Rp. {product?.price}
            </h2>
            {isAuthenticated ? (
              <div>
                <h2 className="subTitle">Jumlah</h2>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    radius="full"
                    //   label="quantity"
                    value={quantity}
                    className="count my-3"
                    classNames={{ input: "text-center" }}
                    onChange={changeQuantityHandler}
                  />
                  <Button
                    radius="full"
                    size="lg"
                    color="primary"
                    isIconOnly
                    onClick={increaseQtyHandler}
                  >
                    <PlusIcon className="h-4 text-white" />
                  </Button>
                  <Button
                    radius="full"
                    size="lg"
                    color="primary"
                    isIconOnly
                    onClick={decreaseQtyHandler}
                  >
                    <MinusIcon className="h-4 text-white" />
                  </Button>
                </div>
                <Button
                  radius="full"
                  size="lg"
                  color="primary"
                  className="my-5 text-white font-poppins"
                  startContent={<ShoppingBagIcon className="h-5" />}
                  disabled={product?.stock <= 0}
                  onClick={setItemToCart}
                >
                  + Keranjang
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
          {/* Product review section */}
          <div className="product-review flex flex-col rounded-xl shadow-md w-full p-5 ">
            {isAuthenticated ? (
              <h1>
                <NewReview productId={product?._id} />
              </h1>
            ) : (
              <>
                <h2 className="subTitle">Ulasan</h2>
                <div className="bg-red-200 p-5 rounded-xl mt-5">
                  Login to post your review
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="list-review content flex flex-col w-full">
        {product?.reviews?.length > 0 ? (
          <ListReviews reviews={product?.reviews} />
        ) : (
          <div className="product-review flex flex-col rounded-xl shadow-md w-full p-5">
            <p className="paragraphDetail">Belum terdapat review</p>
          </div>
        )}
      </div>
    </>
  );
};
export default ProductDetails;
