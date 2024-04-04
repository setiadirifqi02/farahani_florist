import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import {
  Cog6ToothIcon,
  EnvelopeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";

import {
  useGetUserDetailsByAdminQuery,
  useUpdateUserByAdminMutation,
} from "../../redux/api/userApi";

const UpdateUser = () => {
  const [role, setRole] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const params = useParams();
  const navigate = useNavigate();

  const { data } = useGetUserDetailsByAdminQuery(params?.id);

  const [updateUser, { error, isSuccess, isLoading }] =
    useUpdateUserByAdminMutation();
  const onChangeRoleHandler = (e) => {
    setRole(e.target.value);
  };

  useEffect(() => {
    if (data?.user) {
      setName(data?.user?.name);
      setEmail(data?.user?.email);
      setRole(data?.user?.role);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Profile pengguna telah diupdate");
      navigate("/admin/users");
    }
  }, [error, isSuccess, isLoading]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      role,
    };
    updateUser({ id: params?.id, body: userData });
  };
  return (
    <>
      <MetaData title={"Update profile"} />
      <AdminLayout>
        <div className="user-update___page grid w-96">
          {/* Input update profile section */}
          <form
            className="form-login grid  grid-cols-1 gap-2"
            onSubmit={onSubmitHandler}
          >
            <h2 className="subHeadingTitle text-default-600">Nama Pengguna</h2>
            <Input
              label="Nama Pengguna"
              name="nama_pengguna"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukan nama pengguna"
              endContent={<UserIcon className="h-4 text-green-600" />}
              type="text"
            />
            <h2 className="subHeadingTitle text-default-600">Email</h2>
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="masukan nama email"
              endContent={<EnvelopeIcon className="h-4 text-green-500" />}
            />

            <h2 className="subHeadingTitle text-default-600">Role</h2>

            <Select
              label="Role"
              selectedKeys={[role]}
              onChange={onChangeRoleHandler}
              endContent={<Cog6ToothIcon className="h-4 text-green-500" />}
            >
              <SelectItem key="admin" value="admin">
                Admin
              </SelectItem>
              <SelectItem key="user" value="user">
                Pengguna
              </SelectItem>
            </Select>
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
      </AdminLayout>
    </>
  );
};
export default UpdateUser;
