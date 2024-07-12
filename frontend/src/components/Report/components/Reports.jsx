import { Button } from "@nextui-org/react";
import { PrinterIcon } from "@heroicons/react/24/solid";

import "./report.css";
import DataTable from "react-data-table-component";

import { showFormattedDate } from "../../../helpers/helpers";

const ReportsLayout = ({ data, columns, customStyles, user, reportTitle }) => {
  const handlePrint = () => {
    window.print();
  };

  const todayDate = new Date();
  return (
    <div className="flex w-full flex-col items-end p-5 md:p-10">
      <Button
        onClick={handlePrint}
        color="primary"
        className="w-[100px] text-white font-poppins"
        startContent={<PrinterIcon className="h-4 text-white" />}
      >
        Cetak
      </Button>

      <div className="print-only flex flex-col w-full mt-5">
        <div className="reports-header flex flex-col md:flex-row w-full justify-between ">
          <div className="flex gap-4">
            <div id="logo" className="flex">
              <img src="/icons/logo.png" alt="Company Logo" />
            </div>
            <div className="flex flex-col">
              <p className="font-lora text-lg">Farhani Florist Online Shop</p>
              <p className="text-[9px] font-poppins md:w-52">
                Rempoah Baturraden Purwokerto, Kab.Banyumas, Jawa Tengah
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-lora mt-5 md:mt-0 text-lg">
              Data {reportTitle}
            </h2>
          </div>
        </div>
        <DataTable
          className="font-poppins "
          columns={columns}
          data={data}
          customStyles={customStyles}
          pagination
        />

        <div className="reports-footer__container flex flex-col mt-10 relative font-poppins text-justify">
          <p>
            Data dan informasi yang tercantum pada laporan ini merupakan data
            yang faktual dan sebenar-benarnya. Keakuratan data dan informasi
            dalam laporan informasi ini dapat dipertanggung jawabkan. Terima
            kasih atas kepercayaan Anda.
          </p>

          <div className="absolute top-40 md:top-24 right-4">
            <p>Banyumas, {showFormattedDate(todayDate)}</p>
            <div className="blank_signature h-24 md:h-40"></div>

            <p className="text-center">{user?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportsLayout;
