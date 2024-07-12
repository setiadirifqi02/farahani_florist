import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetAllUsersByAdminQuery } from "../../redux/api/userApi";

import { Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import ReportsLayout from "./components/Reports";

const UserReport = () => {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, error } = useGetAllUsersByAdminQuery();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  if (isLoading) return <Spinner color="primary" />;

  const columns = [
    {
      name: "ID",
      selector: (row) => row?._id,
      width: "240px",
    },
    {
      name: "Nama",
      selector: (row) => row?.name,
      sortable: true,
      width: "210px",
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
  ];

  return (
    <div className="user-report___container flex flex-col w-full overflow-x-scroll">
      <MetaData title={"Laporan Data Daftar Pengguna"} />
      <ReportsLayout
        user={user?.user}
        data={data?.users}
        columns={columns}
        reportTitle={"Daftar Pengguna"}
      />
    </div>
  );
};
export default UserReport;
