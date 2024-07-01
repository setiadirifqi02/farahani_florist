import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Avatar, Button, Input, Spinner } from "@nextui-org/react";
import { PhotoIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";
import {
  useDeleteProductImagesMutation,
  useGetProductsDetailsQuery,
  useUploadProductImagesMutation,
} from "../../redux/api/productsApi";

const UploadProductImages = () => {
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const params = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { data } = useGetProductsDetailsQuery(params?.id);

  const [uploadProductImages, { isLoading, error, isSuccess }] =
    useUploadProductImagesMutation();

  const [
    deleteProductImage,
    { isLoading: isDeleteLoading, error: deleteError },
  ] = useDeleteProductImagesMutation();

  useEffect(() => {
    if (data?.product) {
      setUploadedImages(data?.product?.images);
    }
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      setImagesPreview([]);
      toast.success("Produk telah diperbaharui");
      navigate("/admin/products");
    }
  }, [data, error, isSuccess, deleteError]);

  const onChangeHandler = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImagePreview = (image) => {
    const filteredImagesPreview = imagesPreview.filter((img) => img != image);

    setImages(filteredImagesPreview);
    setImagesPreview(filteredImagesPreview);
  };

  const handleResetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (images == "") {
      toast.error("Mohon masukkan file gambar");
    } else {
      uploadProductImages({ id: params?.id, body: { images } });
    }
  };

  const deleteImage = (imgId) => {
    deleteProductImage({ id: params?.id, body: { imgId } });
  };

  if (isLoading) return <Spinner color="primary" />;
  return (
    <>
      <MetaData title="Unggah Foto Produk" />
      <AdminLayout>
        <div className="upload-product-photo___page">
          <form
            className="form-login flex  w-full flex-col"
            onSubmit={onSubmitHandler}
          >
            <h2 className="subHeadingTitle text-default-600">
              Unggah Foto produk {data?.product?.name}
            </h2>
            <Input
              label=" "
              ref={fileInputRef}
              name="product_images"
              onChange={onChangeHandler}
              onClick={handleResetFileInput}
              value={""}
              endContent={<PhotoIcon className="h-4 text-green-600" />}
              type="file"
              accept="image/png, image/jpeg"
              multiple
              className="w-[350px] md:w-[400px] my-3"
            />

            {/* New Images */}
            {imagesPreview.length > 0 && (
              <div className="new-images my-4">
                <h2 className="subHeadingTitle text-default-600">
                  Foto produk baru
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4">
                  {imagesPreview?.map((img, i) => (
                    <div className=" mt-4" key={i}>
                      <div className="col-md-3 mt-2">
                        <div className="card flex flex-col items-center">
                          <Avatar
                            radius="lg"
                            src={img}
                            alt="Card"
                            className="w-20 h-20 text-large mb-1"
                          />
                          <Button
                            type="button"
                            color="danger"
                            onClick={() => handleDeleteImagePreview(img)}
                          >
                            <XMarkIcon className="h-6 text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Image */}
            <div className="uploaded-images mt-1">
              {uploadedImages?.length > 0 && (
                <div>
                  <h2 className="subHeadingTitle text-default-600">
                    Foto produk sebelumnya
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {uploadedImages?.map((img, i) => (
                      <div className="col-md-3 mt-2" key={i}>
                        <div className="card">
                          <Avatar
                            radius="lg"
                            src={img?.url}
                            alt="Card"
                            className="w-20 h-20 text-large mb-1"
                          />
                          <Button
                            color={
                              isLoading || isDeleteLoading
                                ? "default"
                                : "danger"
                            }
                            className=" mt-1 py-0"
                            disabled={isLoading || isDeleteLoading}
                            type="button"
                            onClick={() => deleteImage(img?.public_id)}
                          >
                            {isLoading || isDeleteLoading ? (
                              <Spinner color="primary" />
                            ) : (
                              <TrashIcon className="h-6 text-white" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex w-full lg:max-w-md flex-col  mt-5">
              <Button
                type="submit"
                color="primary"
                className="text-white w-full md:w-[100px]"
                disabled={isLoading}
              >
                {isLoading ? "Mengunggah..." : "Unggah"}
              </Button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
};
export default UploadProductImages;
