import { useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

import { Spinner, Tooltip } from "@nextui-org/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

import toast from "react-hot-toast";

import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";
import {
  useDeleteUserByAdminMutation,
  useGetAllUsersByAdminQuery,
} from "../../redux/api/userApi";

const ListOfUsers = () => {
  const { data, isLoading, error } = useGetAllUsersByAdminQuery();

  const [
    deleteUser,
    { error: deleteError, isSuccess, isLoading: isDeleteLoading },
  ] = useDeleteUserByAdminMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Pengguna dihapus");
    }
  }, [error, deleteError, isSuccess]);

  if (isLoading) return <Spinner color="primary" />;

  const deleteUserHandler = (id) => {
    deleteUser(id);
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row?._id,
    },
    {
      name: "Nama",
      selector: (row) => row?.name,
    },
    {
      name: "Email",
      selector: (row) => row?.email,
    },

    {
      name: "Email",
      selector: (row) => row?.role,
    },

    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-1">
          <Tooltip
            className="text-white"
            showArrow={true}
            color="primary"
            content="Eidit Order"
          >
            <Link to={`/admin/users/${row?._id}`} className="btn btn-primary">
              <PencilIcon className="h-4 text-green-500 " />
            </Link>
          </Tooltip>
          <Tooltip
            className="text-white"
            showArrow={true}
            color="danger"
            content="Hapus Produk"
          >
            <button
              className="mx-2"
              onClick={() => deleteUserHandler(row?._id)}
              disabled={isDeleteLoading}
            >
              <TrashIcon className="h-4 text-red-500 " />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <MetaData title="Daftar Pengguna" />
      <AdminLayout>
        <div className="list-user__page flex flex-col overflow-clip lg:overflow-visible">
          <h2 className="subHeadingTitle capitalize py-3">
            Daftar Pengguna: {data?.users?.length}
          </h2>
          <DataTable
            className="font-poppins"
            columns={columns}
            data={data?.users}
            pagination
          />
        </div>
      </AdminLayout>
    </>
  );
};
export default ListOfUsers;
