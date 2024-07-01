import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Divider,
  Input,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { FunnelIcon } from "@heroicons/react/24/solid";
import StarRatings from "react-star-ratings";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { PRODUCT_CATEGORIES } from "../../constants/constants.js";
import { getPricequeryParams } from "../../helpers/helpers.js";

const Filter = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selItem, setSelItem] = useState(null);

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  useEffect(() => {
    searchParams.has("min") && setMin(searchParams.get("min"));
    searchParams.has("max") && setMax(searchParams.get("max"));
  }, []);

  const handlePriceFilter = (e) => {
    e.preventDefault();
    if (min === "") {
      toast.error("masukkan harga minimal");
    }
    if (max === "") {
      toast.error("masukkan harga maximum");
    }

    searchParams = getPricequeryParams(searchParams, "min", min);
    searchParams = getPricequeryParams(searchParams, "max", max);

    const path = window.location.pathname + "?" + searchParams.toString();
    navigate(path);
  };

  const handleCategoryRatingFilter = (checkbox) => {
    const checkboxes = document.getElementsByName(checkbox.name);

    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });

    if (checkbox.checked === false) {
      // Delete filter from query
      if (searchParams.has(checkbox.name)) {
        searchParams.delete(checkbox.name);
        const path = window.location.pathname + "?" + searchParams.toString();
        navigate(path);
      }
    } else {
      // Set new filter value if already there
      if (searchParams.has(checkbox.name)) {
        searchParams.set(checkbox.name, checkbox.value);
      } else {
        // Append new filter
        searchParams.append(checkbox.name, checkbox.value);
      }
      const path = window.location.pathname + "?" + searchParams.toString();
      navigate(path);
    }
  };

  const defaultCheckHandler = (checkboxType, checkboxValue) => {
    const value = searchParams.get(checkboxType);
    if (checkboxValue === value) return true;
    return false;
  };

  const clearFilterHandler = () => {
    navigate("/all_products");
  };

  return (
    <div className="filter___container">
      <Button
        color="primary"
        className="text-white font-poppins"
        onPress={onOpen}
        endContent={<FunnelIcon className="text-white h-6" />}
      >
        Filter
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="sm"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="subHeadingTitle">Filter Produk</h2>
              </ModalHeader>
              <ModalBody>
                {/* Price filter Section */}
                <p className="subTitle mt-[-10px]">Harga</p>
                <form
                  className="price-filter flex flex-col gap-2"
                  onSubmit={handlePriceFilter}
                >
                  <div className="flex gap-1">
                    <Input
                      type="text"
                      label="min"
                      size="sm"
                      value={min}
                      onChange={(e) => setMin(e.target.value)}
                    />
                    <Input
                      type="text"
                      label="max"
                      size="sm"
                      value={max}
                      onChange={(e) => setMax(e.target.value)}
                    />
                  </div>
                  <div className="flex ">
                    <Button
                      type="submit"
                      color="primary"
                      className="text-white font-poppins"
                    >
                      Go
                    </Button>
                  </div>
                </form>
                <Divider />

                {/* Category filter Section */}
                <p className="subTitle mt-[-10px]">Kategori</p>
                <div className="category-filter flex flex-col gap-2">
                  {PRODUCT_CATEGORIES.map((category) => (
                    <div className="form-check flex gap-3" key={category}>
                      <input
                        className="form-check-input accent-green-500 scale-150 rounded-xl"
                        type="checkbox"
                        name="category"
                        id="check"
                        value={category}
                        defaultChecked={defaultCheckHandler(
                          "category",
                          category
                        )}
                        onClick={(e) => handleCategoryRatingFilter(e.target)}
                      />
                      <label
                        className="form-check-label ml-2 font-poppins"
                        htmlFor="check4"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
                <Divider />

                {/* Rating filter Section */}
                <p className="subTitle mt-[-10px]">Rating</p>
                <div className="rating-filter flex flex-col gap-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div
                      className="filter-form flex gap-4 items-center"
                      key={rating}
                    >
                      <input
                        className="form-check-input accent-green-500 scale-150 rounded-xl"
                        type="checkbox"
                        name="ratings"
                        id="check7"
                        value={rating}
                        defaultChecked={defaultCheckHandler(
                          "ratings",
                          rating?.toString()
                        )}
                        onClick={(e) => handleCategoryRatingFilter(e.target)}
                      />
                      <label className="form-check-label" htmlFor="check7">
                        <StarRatings
                          rating={rating}
                          starRatedColor="#eab308"
                          numberOfStars={5}
                          name="rating"
                          starDimension="20px"
                          starSpacing="2px"
                          className="ml-2"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onClose}
                  className="text-white"
                  onClick={clearFilterHandler}
                >
                  Clear Filter
                </Button>
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default Filter;
