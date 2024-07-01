import { Button } from "@nextui-org/react";
import { CloudArrowDownIcon } from "@heroicons/react/24/solid";
import { CSVLink } from "react-csv";

const ExportCSVButton = ({ data, headers, filename }) => {
  return (
    <CSVLink data={data} headers={headers} filename={filename}>
      <Button
        variant="light"
        className="font-poppins"
        startContent={<CloudArrowDownIcon className="h-4 text-blue-500 " />}
      >
        Download CSV
      </Button>
    </CSVLink>
  );
};
export default ExportCSVButton;
