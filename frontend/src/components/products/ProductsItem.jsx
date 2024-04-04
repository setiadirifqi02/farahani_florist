import { Link as routerLink } from "react-router-dom";
import StarRatings from "react-star-ratings";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Button,
  Link,
} from "@nextui-org/react";
import { rupiahConverter } from "../../helpers/rupiahConverter.js";

const ProductsItem = ({ products }) => {
  return (
    <Card className="product-item__container py-4" shadow="none" isPressable>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={
            products?.images[0] ? products?.images[0]?.url : "/images/daun.jpg"
          }
          width={270}
        />
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <p className="text-sm md:text-large capitalize font-poppins font-semibold text-green-600">
          <Link as={routerLink} to={`/products/${products?._id}`}>
            {products?.name}
          </Link>
        </p>
        <div className="ratings mt-auto flex items-center">
          <div className="star-ratings flex gap-1 md:gap-2">
            <StarRatings
              rating={products?.ratings}
              starRatedColor="#eab308"
              numberOfStars={5}
              name="rating"
              starDimension="15px"
              starSpacing="2px"
            />
          </div>
          <span
            id="no_of_reviews"
            className="pt-2 ml-2 text-sm md:text-md font-poppins"
          >
            ({products?.numOfReviews})
          </span>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start mt-2 md:mt-5">
          <div className="flex flex-col">
            <small className="font-bold text-gray-400 font-poppins">
              Price
            </small>
            <h4 className="font-bold text-default-500 text-md lg:text-xs xl:text-lg font-poppins">
              {rupiahConverter(`${products?.price}`)}
            </h4>
          </div>
          <Button
            color="primary"
            size="sm"
            className="text-white font-poppins w-full lg:w-24  mt-2"
            id="view_btn"
            as={routerLink}
            to={`/products/${products?._id}`}
          >
            Lihat Detail
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
export default ProductsItem;
