import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

import { useAddNewProductMutation } from "../../redux/api/productsApi";

const NewProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    color: "non-color",
  });

  const [createProduct, { error, isLoading, isSuccess }] =
    useAddNewProductMutation();

  const { name, description, price, category, stock, color } = product;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Produk baru ditambah");
      navigate("/admin/products");
    }
  }, [error, isSuccess]);

  if (isLoading) return <Spinner color="primary" />;

  const onChangeHandler = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    createProduct(product);
  };

  return (
    <>
      <AdminLayout>
        <MetaData title="Tambah Produk Baru" />

        <div className="new-product__page flex flex-col w-full">
          <form onSubmit={onSubmitHandler}>
            <h2 className="subHeadingTitle">Tambah Produk Baru</h2>
            <h2 className="subTitle mb-4">Nama Produk</h2>

            <Input
              type="text"
              label="Produk Baru"
              name="name"
              value={name}
              onChange={onChangeHandler}
              placeholder="Masukan nama produk baru"
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
                  placeholder="Masukan harga produk baru"
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
                  placeholder="Masukan stok produk baru"
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
                  placeholder="Masukan warna produk baru"
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
export default NewProduct;
