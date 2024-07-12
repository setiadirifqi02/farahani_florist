import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { rupiahConverter } from "../../../helpers/rupiahConverter";

const SalesSummaryTable = ({ data }) => {
  return (
    <div className="sales-summary__table flex flex-col">
      <h2 className="subHeadingTitle w-full capitalize py-3">
        Rincian Informasi
      </h2>

      <Table
        removeWrapper
        color="default"
        selectionMode="single"
        aria-label="Example static collection table"
        className="font-poppins"
      >
        <TableHeader>
          <TableColumn>Nama</TableColumn>
          <TableColumn>Jumlah</TableColumn>
          <TableColumn>Total Rp._</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>Pesanan Selesai</TableCell>
            <TableCell>{data?.numOfCompletedSales}</TableCell>
            <TableCell>{rupiahConverter(data?.totalCompletedSales)}</TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>Pesanan Diproses</TableCell>
            <TableCell>{data?.numOfProcessingSales}</TableCell>
            <TableCell>{rupiahConverter(data?.totalProcessingSales)}</TableCell>
          </TableRow>
          <TableRow key="3">
            <TableCell>Pesanan Dibatalkan</TableCell>
            <TableCell>{data?.numOfCancelSales}</TableCell>
            <TableCell>{rupiahConverter(data?.totalCancelSales)}</TableCell>
          </TableRow>
          <TableRow key="4">
            <TableCell>Pesanan COD</TableCell>
            <TableCell>{data?.numOfCodSales}</TableCell>
            <TableCell>{rupiahConverter(data?.totalCodSales)}</TableCell>
          </TableRow>
          <TableRow key="5">
            <TableCell>Pesanan Pembayaran Online</TableCell>
            <TableCell>{data?.numOfOnlinePaymentSales}</TableCell>
            <TableCell>
              {rupiahConverter(data?.totalOnlinePaymentSales)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
export default SalesSummaryTable;
