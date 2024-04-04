export const getPricequeryParams = (searchParams, key, value) => {
  const hasValueInParams = searchParams.has(key);

  if (value && hasValueInParams) {
    searchParams.set(key, value);
  } else if (value) {
    searchParams.append(key, value);
  } else if (hasValueInParams) {
    searchParams.delete(key);
  }

  return searchParams;
};

export const calculateOrderCost = (cartItems) => {
  const itemsPrice = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingPrice = itemsPrice > 500000 ? 20000 : 0;

  const taxPrice = Number(0 * itemsPrice.toFixed(2));

  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  return {
    itemsPrice,
    shippingPrice,
    taxPrice: Number(taxPrice).toFixed(2),
    totalPrice,
  };
};
