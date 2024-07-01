import { useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

import { Spinner, Tooltip } from "@nextui-org/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

import toast from "react-hot-toast";

import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";
import ExportCSVButton from "../atoms/ExportCSVButton";

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

  // colomn of react data table component
  const columns = [
    {
      name: "ID",
      selector: (row) => row?._id,
      width: "220px",
    },
    {
      name: "Nama",
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      sortable: true,
      width: "220px",
    },

    {
      name: "Role",
      selector: (row) => row?.role,
      sortable: true,
      width: "80px",
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

  // colomn header for export to csv file
  const headers = [
    { label: "ID", key: "_id" },
    { label: "Nama", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
  ];

  return (
    <>
      <MetaData title="Daftar Pengguna" />
      <AdminLayout>
        <div className="list-user__page flex flex-col overflow-scroll lg:overflow-scroll">
          <div className="flex w-full justify-between items-center lg:pr-2">
            <h2 className="subHeadingTitle capitalize py-3">
              Daftar Pengguna: {data?.users?.length}
            </h2>

            {/* Export to csv button */}
            {data?.users ? (
              <ExportCSVButton
                data={data?.users}
                headers={headers}
                filename={"Data Pengguna Farhani Florist"}
              />
            ) : (
              <></>
            )}
          </div>
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
