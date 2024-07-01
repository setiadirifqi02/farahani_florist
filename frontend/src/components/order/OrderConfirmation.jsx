import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DataTable from "react-data-table-component";

import {
  Spinner,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { EyeIcon, CheckIcon } from "@heroicons/react/24/solid";

import MetaData from "../layout/MetaData";

import {
  useConfirmedOrderByUserMutation,
  useMyOrdersQuery,
  useOrdersConfirmationQuery,
} from "../../redux/api/orderApi";
import { useDispatch } from "react-redux";
import { clearCartItem } from "../../redux/features/cartSlice";
import { showFormattedDate } from "../../helpers/helpers";

const OrderConfirmation = () => {
  const [orderId, setOrderId] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isLoading, error } = useOrdersConfirmationQuery();
  const [confirmedOrderByUser, { error: confirmedOrderError, isSuccess }] =
    useConfirmedOrderByUserMutation();

  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderSuccess = searchParams.get("order_success");

  const handleOpen = (id) => {
    onOpen(id);
    setOrderId(id);
  };

  const orderConfirmationHandler = () => {
    console.log(orderId);

    const id = orderId;
    const data = { isConfirmedByUser: "Dikonfirmasi" };

    confirmedOrderByUser({ id, body: data });
  };

  // UseEffect for fetching Data
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (orderSuccess) {
      dispatch(clearCartItem());
      navigate("/me/orders_confirmation");
    }
  }, [error, orderSuccess]);

  // UseEffect for order confirmation
  useEffect(() => {
    if (confirmedOrderError) {
      toast.error(confirmedOrderError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Pesanan telah dikonfirmasi ");
    }
  }, [confirmedOrderError, isSuccess]);

  if (isLoading) return <Spinner color="primary" />;

  const columns = [
    {
      name: "ID",
      selector: (row) => row._id,
      sortable: true,
    },
    {
      name: "Dibayar",
      selector: (row) => row.totalAmount,
    },
    {
      name: "Status Pembayaran",
      selector: (row) => row.paymentInfo.status,
    },
    {
      name: "Status Pesanan",
      selector: (row) => row.orderStatus,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => showFormattedDate(row?.updatedAt),
    },
    {
      name: "Konfirmasi",
      selector: (row) => row.isConfirmedByUser,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-1">
          <Tooltip
            className="text-white"
            showArrow={true}
            color="primary"
            content="Lihat Rincian"
          >
            <Link to={`/me/order/${row?._id}`} className="btn btn-primary">
              <EyeIcon className="h-4 text-green-500 " />
            </Link>
          </Tooltip>
          <Tooltip
            className="text-white"
            showArrow={true}
            color="primary"
            content="Konfirmasi pesanan"
          >
            <Link
              onClick={() => handleOpen(row?._id)}
              className="btn btn-success ms-2"
            >
              <CheckIcon className="h-4 text-green-500 " />
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <MetaData title="Daftar Pesanan" />
      <div className="my-order__page flex flex-col content w-full">
        <h2 className="subHeadingTitle w-full capitalize py-3">
          {" "}
          Daftar Konfirmasi Pesanan anda : {data?.orders?.length}
        </h2>
        <div className="flex h-36 w-full bg-yellow-100 p-5 md:p-8 my-5 rounded-xl">
          <p className="text-yellow-600 font-poppins text-sm md:text-lg">
            Mohon Lakukan konfirmasi pesanan setelah produk yang dibeli sudah
            diterima dengan mengeklik tombol checklist pada item yang dibeli!
          </p>
        </div>
        <DataTable
          className="font-poppins"
          columns={columns}
          data={data?.orders}
          pagination
        />

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 font-poppins">
                  Konfirmasi Pesanan
                </ModalHeader>
                <ModalBody>
                  <p className="font-poppins">
                    Dengan menekan tombol konfirmasi anda telah mengkonfirmasi
                    bahwa pesanan telah diterima
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    className="font-poppins"
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    className="text-white font-poppins"
                    onPress={onClose}
                    onClick={orderConfirmationHandler}
                  >
                    Konfirmasi
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};
export default OrderConfirmation;
