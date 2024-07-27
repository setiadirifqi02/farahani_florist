import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUpdateUserProfileMutation } from "../../redux/api/userApi";
import { useSelector } from "react-redux";

import { Button, Input, SelectItem, Select, Divider } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/solid";

import indonesia from "territory-indonesia";

import UserLayout from "../layout/UserLayout";
import MetaData from "../layout/MetaData";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [provinsiData, setProvinsiData] = useState("");
  const [province, setProvince] = useState("Jawa Tengah");
  const [regencyData, setRegencyData] = useState("");
  const [city, setCity] = useState("Kabupaten Pemalang");
  const [districtData, setDistrictData] = useState("");
  const [district, setDistrict] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading, error, isSuccess }] =
    useUpdateUserProfileMutation();

  useEffect(() => {
    if (user) {
      setName(user?.user?.name);
      setEmail(user?.user?.email);
      setAddress(user?.user?.shippingInfo?.address);
      setProvince(user?.user?.shippingInfo?.province);
      setCity(user?.user?.shippingInfo?.city);
      setDistrict(user?.user?.shippingInfo?.district);
      setZipCode(user?.user?.shippingInfo?.zipCode);
      setPhoneNo(user?.user?.shippingInfo?.phoneNo);
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Profile pengguna telah diupdate");
      navigate("/me/profile");
    }
  }, [user, error, isSuccess]);

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

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (name.length === 0 && name === "") {
      toast.error("Mohon masukkan nama pengguna");
    } else if (email.length === 0 && email === "") {
      toast.error("Mohon masukkan alamat email");
    } else {
      const country = "Indonesia";
      const shippingInfo = {
        address,
        zipCode,
        city,
        province,
        district,
        phoneNo,
        country,
      };

      const profileUpdateData = {
        name,
        email,
        shippingInfo,
      };
      updateProfile(profileUpdateData);
    }
  };

  return (
    <>
      <MetaData title={"Update profile"} />
      <UserLayout>
        <div className="user-update___page">
          {/* Input update profile section */}
          <form
            className="form-login flex  w-full flex-col"
            onSubmit={onSubmitHandler}
          >
            <h2 className="subHeadingTitle mb-4 mt-10">Personal</h2>
            <Divider />
            <h2 className="subTitle text-default-600">Nama Pengguna</h2>
            <Input
              label="Nama Pengguna"
              name="nama_pengguna"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukan nama pengguna"
              endContent={<UserIcon className="h-4 text-green-600" />}
              type="text"
              className="w-[350px] md:w-[400px] my-3"
            />
            <h2 className="subTitle text-default-600">Email</h2>
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="masukan nama email"
              className="w-[350px] md:w-[400px] my-3"
              endContent={<EnvelopeIcon className="h-4 text-green-500" />}
            />

            <h2 className="subHeadingTitle mb-4 mt-10">Informasi Pengiriman</h2>
            <Divider />
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
                label="Kecamatan"
                name="Kecamatan"
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
            <div className="flex w-full lg:max-w-md flex-col items-end mt-5">
              <Button
                type="submit"
                color="primary"
                className="text-white w-full md:w-[100px]"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </div>
      </UserLayout>
    </>
  );
};
export default UpdateProfile;
