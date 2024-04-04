import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Spinner,
} from "@nextui-org/react";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";

import StarRatings from "react-star-ratings";
import { useEffect, useState } from "react";
import {
  useCanUserReviewQuery,
  useSubmitReviewMutation,
} from "../../redux/api/productsApi";

const NewReview = ({ productId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [submitReview, { isLoading, error, isSuccess }] =
    useSubmitReviewMutation();

  const { data } = useCanUserReviewQuery(productId);
  const canReview = data?.canReview;

  // console.log(canReview);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Ulasan telah dikirim");
    }
  }, [error, isSuccess]);

  if (isLoading) return <Spinner color="primary" />;

  const onSubmitHandler = () => {
    const reviewData = { rating, comment, productId };

    submitReview(reviewData);
  };

  return (
    <>
      {canReview ? (
        <Button
          startContent={
            <ChatBubbleBottomCenterTextIcon className="h-6 text-white" />
          }
          color="primary"
          className="text-white font-poppins"
          onPress={onOpen}
        >
          Beri Ulasan
        </Button>
      ) : (
        <p className="paragraphDetail">Anda belum membeli produk ini</p>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1  font-poppins">
                Beri Ulasan
              </ModalHeader>
              <ModalBody>
                <h2 className="subTitle">Rating</h2>
                <div className="star">
                  <StarRatings
                    rating={rating}
                    starRatedColor="#eab308"
                    numberOfStars={5}
                    name="rating"
                    starDimension="25px"
                    starSpacing="2px"
                    changeRating={(e) => setRating(e)}
                  />
                </div>

                <h2 className="subTitle">Ulasan </h2>
                <Textarea
                  label="Ulasan"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Masukan ulasan produk"
                  className="font-poppins"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  className="font-poppins"
                  onPress={onClose}
                >
                  Tutup
                </Button>
                <Button
                  color="primary"
                  className="font-poppins text-white"
                  onPress={onClose}
                  onClick={onSubmitHandler}
                >
                  Kirim
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default NewReview;
