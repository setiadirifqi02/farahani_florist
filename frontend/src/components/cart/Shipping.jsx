import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Input, SelectItem, Select } from "@nextui-org/react";

import { useDispatch, useSelector } from "react-redux";
import { saveShippigInfo } from "../../redux/features/cartSlice";

import indonesia from "territory-indonesia";

import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import { toast } from "react-hot-toast";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [provinsiData, setProvinsiData] = useState("");
  const [province, setProvince] = useState("Jawa Tengah");
  const [regencyData, setRegencyData] = useState("");
  const [city, setCity] = useState("");
  const [districtData, setDistrictData] = useState("");
  const [district, setDistrict] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  // const { shippingInfo } = useSelector((state) => state.cart);
  // const { user } = useSelector((state) => state?.auth);
  const { user } = useSelector((state) => state.auth);
  const shippingInfo = user?.user?.shippingInfo;

  // render data of profvice
  useEffect(() => {
    if (provinsiData.length === 0) {
      const getProvinsi = async () => {
        const provinsi = await indonesia.getAllProvinces();
        setProvinsiData(provinsi);
      };

      getProvinsi();
    }
  }, []);

  // render data of kabupaten
  useEffect(() => {
    const getKabupaten = async () => {
      if (province) {
        const kabupaten = await indonesia.getRegenciesOfProvinceName(province);
        setRegencyData(kabupaten);
      }
    };

    getKabupaten();
  }, [province]);

  // console.log(province, city);

  // render data of kecamatan
  useEffect(() => {
    const getKecamatan = async () => {
      if (city) {
        const kecamatan = await indonesia.getDistrictsOfRegencyName(city);
        setDistrictData(kecamatan);
      }
    };

    getKecamatan();
  }, [city]);

  useEffect(() => {
    if (shippingInfo) {
      setAddress(shippingInfo?.address);
      setProvince(shippingInfo?.province);
      setCity(shippingInfo?.city);
      setDistrict(shippingInfo?.district);
      setZipCode(shippingInfo?.zipCode);
      setPhoneNo(shippingInfo?.phoneNo);
    }
  }, [shippingInfo]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const country = "Indonesia";
    dispatch(
      saveShippigInfo({
        address,
        zipCode,
        city,
        province,
        district,
        phoneNo,
        country,
      })
    );

    navigate("/confirm_order");
  };

  return (
    <>
      <MetaData title="Pengiriman" />
      <CheckoutSteps shipping />
      <div className="shipping___page px-3 md:px-10 flex w-full">
        <div className="shipping__input flex flex-col w-full md:w-7/12 md:px-3 py-10">
          <h2 className="headingTitle">Informasi Pengiriman</h2>
          <p className="md:max-sm: paragraphDetail py-4">
            Pastikan alamat yang diisi sudah lengkap dan benar sehingga produk
            kesayanganmu sampai ke tujuan.
          </p>
          <form
            className="form-shipping flex flex-col items-start"
            onSubmit={onSubmitHandler}
          >
            <h2 className="subTitle mb-4">Alamat</h2>
            <Input
              type="text"
              label="Alamat"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masukan lamat"
              className=" lg:max-w-md"
              isRequired
            />
            <h2 className="subTitle mb-4">Provinsi</h2>
            {provinsiData.length > 0 ? (
              <Select
                label="Provinsi"
                name="Provinsi"
                className=" lg:max-w-md"
                selectedKeys={[province]}
                onChange={(e) => setProvince(e.target.value)}
              >
                {provinsiData?.map((item) => (
                  <SelectItem key={item?.name} value={item?.name}>
                    {item?.name}
                  </SelectItem>
                ))}
              </Select>
            ) : null}

            <h2 className="subTitle mb-4">Kabupaten/Kota</h2>
            {regencyData.length > 0 ? (
              <Select
                label="Kabupaten"
                name="Kabupaten"
                className=" lg:max-w-md"
                selectedKeys={[city]}
                onChange={(e) => setCity(e.target.value)}
              >
                {regencyData?.map((item) => (
                  <SelectItem key={item?.name} value={item?.name}>
                    {item?.name}
                  </SelectItem>
                ))}
              </Select>
            ) : null}

            <h2 className="subTitle mb-4">Kecamatan</h2>
            {districtData.length > 0 ? (
              <Select
                label="Kabupaten"
                name="Kabupaten"
                className=" lg:max-w-md"
                selectedKeys={[district]}
                onChange={(e) => setDistrict(e.target.value)}
              >
                {districtData?.map((item) => (
                  <SelectItem key={item?.name} value={item?.name}>
                    {item?.name}
                  </SelectItem>
                ))}
              </Select>
            ) : null}

            <h2 className="subTitle mb-4">Kode Pos</h2>
            <Input
              type="text"
              label="Kode pos"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Masukan kode pos"
              className=" lg:max-w-md"
              isRequired
            />
            {/* <h2 className="subTitle mb-4">Kabupaten/Kota</h2>
            <Input
              type="text"
              label="Kabupaten/kota"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Masukan kabupaten/kota"
              className=" lg:max-w-md"
              isRequired
            />
            <h2 className="subTitle mb-4">Provinsi</h2>
            <Input
              type="text"
              label="Provinsi"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Masukan provinsi"
              className=" lg:max-w-md"
              isRequired
            /> */}
            <h2 className="subTitle mb-4">Nomor Telp</h2>
            <Input
              type="text"
              label="Nomor Telp"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              placeholder="Masukan nomor telepon/Hp"
              className=" lg:max-w-md"
              isRequired
            />

            <div className="flex w-full lg:max-w-md flex-col items-center justify-center mt-5 ">
              <Button
                type="submit"
                color="primary"
                className="text-white w-full"
                // disabled={isLoading}
              >
                {/* {isLoading ? "Loading..." : "Login"} */}
                Submit
              </Button>
            </div>
          </form>
        </div>
        <div
          className="shipping__hero sticky  top-32 hidden md:flex items-center 
      justify-center rounded-2xl  w-5/12 md:h-[440px] lg:h-[620px] 
       bg-cover bg-center bg-no-repeat bg-[url('/images/shipping.webp')]"
        ></div>
      </div>
    </>
  );
};
export default Shipping;
