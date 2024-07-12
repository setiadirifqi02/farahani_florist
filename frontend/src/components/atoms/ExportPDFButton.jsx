import { Link as routerLink } from "react-router-dom";
import { CloudArrowDownIcon } from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/react";

const ExportPDFButton = ({ link }) => {
  return (
    <Button
      as={routerLink}
      to={link}
      variant="light"
      className="font-poppins"
      startContent={<CloudArrowDownIcon className="h-4 text-blue-500 " />}
    >
      Download Pdf
    </Button>
  );
};
export default ExportPDFButton;
