import { Link as routerLink, useNavigate } from "react-router-dom";

import { Avatar, Input, Button, Divider, Link } from "@nextui-org/react";
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";

import { useDispatch, useSelector } from "react-redux";
import { setCartItem, removeCartItem } from "../../redux/features/cartSlice";

import { rupiahConverter } from "../../helpers/rupiahConverter";
import MetaData from "../layout/MetaData";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  const increaseQty = (item, quantity) => {
    const newQty = quantity + 1;

    if (newQty > item?.stock) return;

    setItemToCart(item, newQty);
  };

  const decreaseQty = (item, quantity) => {
    const newQty = quantity - 1;

    if (newQty <= 0) return;

    setItemToCart(item, newQty);
  };

  const setItemToCart = (item, newQty) => {
    const cartItem = {
      product: item?.product,
      name: item?.name,
      price: item?.price,
      image: item?.image,
      stock: item?.stock,
      quantity: newQty,
    };

    dispatch(setCartItem(cartItem));
  };

  const removeCartItemHandler = (id) => {
    dispatch(removeCartItem(id));
  };

  const checkOutHandler = () => {
    navigate("/shipping");
  };

  return (
    <>
      <MetaData title="Keranjang Belanja" />
      {cartItems?.length === 0 ? (
        <>
          <div className="shooping-cart__page flex content flex-col w-full lg:flex-row">
            <div className="contet-cart flex flex-col w-full  lg:w-4/6 md:py-5">
              <div className="flex justify-center md:justify-start mb-5 md:mb-10">
                <h2 className="subHeadingTitle capitalize text-center">
                  Keranjang belanjamu kosong
                </h2>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="shoping-cart__page flex content flex-col w-full lg:flex-row">
          <div className="content-cart flex flex-col w-full  lg:w-4/6 md:py-5">
            {/* Prodect list header */}
            <div className="flex justify-between mb-5 md:mb-10">
              <h2 className="subHeadingTitle capitalize">
                Keranjang belanjamu
              </h2>
              <h2 className="subHeadingTitle capitalize">
                <span className="text-green-500">{cartItems?.length} </span>
                Item
              </h2>
            </div>

            {/* product item list */}

            {cartItems?.map((item) => (
              <div
                className="product-items flex flex-col md:flex-row justify-between border-b-2 mb-5"
                key={item?.name}
              >
                <div className="flex mb-5">
                  <Avatar
                    radius="lg"
                    src={item?.image}
                    className="w-32 h-32 text-large"
                  />

                  <div className="product-items-main flex flex-col ml-6 md:ml-10">
                    <Link as={routerLink} to={`/products/${item?.product}`}>
                      <h2 className="subTitle capitalize">{item?.name}</h2>
                    </Link>
                    <h2 className="font-semibold font-poppins text-green-500">
                      {rupiahConverter(item?.price)}
                    </h2>
                    <h2 className="font-poppins tex-lg font-semibold text-default-400 capitalize">
                      {item?.color}
                    </h2>

                    {/* cart control for mobile */}
                    <div className="flex md:hidden gap-2  items-center">
                      <Input
                        type="number"
                        radius="full"
                        variant="underlined"
                        value={item?.quantity}
                        className="count my-3 w-[60px]"
                        classNames={{ input: "text-center" }}
                      />
                      <Button
                        radius="full"
                        size="sm"
                        color="primary"
                        isIconOnly
                        onClick={() => increaseQty(item, item.quantity)}
                      >
                        <PlusIcon className="h-4 text-white" />
                      </Button>

                      <Button
                        radius="full"
                        size="sm"
                        color="primary"
                        isIconOnly
                        onClick={() => decreaseQty(item, item.quantity)}
                      >
                        <MinusIcon className="h-4 text-white" />
                      </Button>

                      <Button
                        radius="full"
                        size="sm"
                        color="primary"
                        isIconOnly
                        onClick={() => removeCartItemHandler(item?.product)}
                      >
                        <TrashIcon className="h-4 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* cart control for Dekstop */}
                <div className="hidden md:flex gap-2  items-center">
                  <Input
                    type="number"
                    radius="full"
                    variant="underlined"
                    value={item?.quantity}
                    className="count my-3 w-[60px]"
                    classNames={{ input: "text-center" }}
                  />
                  <Button
                    radius="full"
                    size="md"
                    color="primary"
                    isIconOnly
                    onClick={() => increaseQty(item, item.quantity)}
                  >
                    <PlusIcon className="h-4 text-white" />
                  </Button>

                  <Button
                    radius="full"
                    size="md"
                    color="primary"
                    isIconOnly
                    onClick={() => decreaseQty(item, item.quantity)}
                  >
                    <MinusIcon className="h-4 text-white" />
                  </Button>
                  <Button
                    radius="full"
                    size="md"
                    color="primary"
                    isIconOnly
                    onClick={() => removeCartItemHandler(item?.product)}
                  >
                    <TrashIcon className="h-4 text-white" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-cart flex flex-col w-full lg:w-2/6 p-3 md:p-5 bg-gray-50 lg:ml-5 rounded-xl sticky">
            <h2 className="subHeadingTitle capitalize">Order Summary</h2>
            <Divider className="mt-5" />
            <div className="flex justify-between items-baseline">
              <h2 className="subTitle">Subtotal</h2>
              <p className="paragraphDetail">
                {cartItems?.reduce((acc, item) => acc + item?.quantity, 0)} unit
              </p>
            </div>
            <div className="flex justify-between items-baseline">
              <h2 className="subTitle"> Total</h2>
              <p className="paragraphDetail">
                {rupiahConverter(
                  cartItems
                    ?.reduce(
                      (acc, item) => acc + item?.quantity * item.price,
                      0
                    )
                    .toFixed(2)
                )}
              </p>
            </div>
            <Button
              color="primary"
              startContent={<CreditCardIcon className="h-4 text-white" />}
              className="text-white mt-5"
              onClick={checkOutHandler}
            >
              Check Out
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
