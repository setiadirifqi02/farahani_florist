import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import toast from "react-hot-toast";

import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";
import { categories } from "../../constants/constants";
import {
  useGetProductsDetailsQuery,
  useUpdateProductMutation,
} from "../../redux/api/productsApi";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    color: "non-color",
  });

  const params = useParams();

  const { data } = useGetProductsDetailsQuery(params.id);

  const [updateProduct, { error, isLoading, isSuccess }] =
    useUpdateProductMutation(params?.id);

  const { name, description, price, category, stock, color } = product;

  useEffect(() => {
    if (data?.product) {
      setProduct({
        name: data?.product.name,
        description: data?.product?.description,
        price: data?.product?.price,
        category: data?.product?.category,
        stock: data?.product?.stock,
        color: data?.product?.color,
      });
    }
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Produk telah diperbaharui");
      navigate("/admin/products");
    }
  }, [data, error, isSuccess]);

  if (isLoading) return <Spinner color="primary" />;

  const onChangeHandler = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    updateProduct({ id: params?.id, body: product });
  };

  return (
    <>
      <AdminLayout>
        <MetaData title="Edit Produk" />

        <div className="update-product__page flex flex-col w-full">
          <form onSubmit={onSubmitHandler}>
            <div>
              <h2 className="subHeadingTitle">Edit Produk </h2>
            </div>
            <h2 className="subTitle mb-4">Nama Produk</h2>

            <Input
              type="text"
              label="Produk Baru"
              name="name"
              value={name}
              onChange={onChangeHandler}
              placeholder="Masukan nama produk"
            />

            <h2 className="subTitle mb-4">Deskripsi</h2>

            <Textarea
              label="Deskripsi"
              placeholder="Desikripsi Lengkap produk"
              name="description"
              value={description}
              onChange={onChangeHandler}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <h2 className="subTitle mb-4">Harga</h2>
                <Input
                  type="text"
                  label="Harga"
                  name="price"
                  value={price}
                  onChange={onChangeHandler}
                  placeholder="Masukan harga produk"
                />
              </div>
              <div>
                <h2 className="subTitle mb-4">Stok</h2>
                <Input
                  type="text"
                  label="Stock"
                  name="stock"
                  value={stock}
                  onChange={onChangeHandler}
                  placeholder="Masukan stok produk"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <h2 className="subTitle mb-4">Kategori</h2>
                <Select
                  label="Pilih kategori"
                  name="category"
                  value={category}
                  onChange={onChangeHandler}
                >
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div>
                <h2 className="subTitle mb-4">Warna</h2>
                <Input
                  type="text"
                  label="Warna"
                  name="color"
                  value={color}
                  onChange={onChangeHandler}
                  placeholder="Masukan warna produk"
                />
              </div>
            </div>
            <Button
              type="submit"
              color="primary"
              className="text-white w-full md:w-44 mt-5"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Submit"}
            </Button>
          </form>
        </div>
      </AdminLayout>
    </>
  );
};
export default UpdateProduct;
