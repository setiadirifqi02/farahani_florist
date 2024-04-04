import { Avatar } from "@nextui-org/react";
import StarRatings from "react-star-ratings";

const ListReviews = ({ reviews }) => {
  return (
    <div className="list-review">
      <h2 className="subTitle">Ulasan Produk</h2>
      {reviews.map((review) => (
        <div
          className="review-content mt-2 py-3 md:py-5 flex gap-5 border-y-2"
          key={review?._id}
        >
          <div className="min-w-[100px]">
            <Avatar
              src={
                review?.user?.avatar
                  ? review?.user?.avatar?.url
                  : "https://i.pravatar.cc/150?u=a04258114e29026708c"
              }
              className="w-20 h-20"
            />
          </div>
          <div className="review-main flex flex-col gap-2">
            <StarRatings
              rating={review?.rating}
              starRatedColor="#eab308"
              numberOfStars={5}
              name="rating"
              starDimension="25px"
              starSpacing="2px"
            />
            <small className="font-poppins font-semibold text-default-500 capitalize">
              oleh {review.user?.name}
            </small>
            <p className="paragraphDetail text-[10px] md:text-sm">
              {review?.comment}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ListReviews;
