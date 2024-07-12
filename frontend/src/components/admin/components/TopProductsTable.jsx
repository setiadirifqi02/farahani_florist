import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { rupiahConverter } from "../../../helpers/rupiahConverter";

const TopProductsTable = ({ data }) => {
  return (
    <div className="top-products__table flex flex-col">
      <h2 className="subHeadingTitle w-full capitalize py-3">
        Produck Terlaris
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
          {data?.map((item) => (
            <TableRow key={item?.productId}>
              <TableCell>{item?.name}</TableCell>
              <TableCell>{item?.totalQuantity}</TableCell>
              <TableCell>
                {rupiahConverter(item?.totalQuantity * item?.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default TopProductsTable;
