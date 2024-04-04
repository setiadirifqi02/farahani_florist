import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

const Carousel = () => {
  const images = [
    "/images/img-banner-1.webp",
    "/images/img-banner-2.webp",
    "/images/img-banner-3.webp",
  ];

  const [curr, setCurr] = useState(0);
  const autoSlide = true;
  const autoSlideInterval = 3000;

  const prevImgae = () => {
    setCurr((curr) => (curr === 0 ? images.length - 1 : curr - 1));
  };

  const nextImage = () => {
    setCurr((curr) => (curr === images.length - 1 ? 0 : curr + 1));
  };
  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(nextImage, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="carousel__container overflow-hidden relative rounded-3xl">
      <div
        className="flex transition-transform ease-out duration-500 max-h-[590px]"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {images.map((image) => (
          <img src={image} key={image} alt={image} className="object-cover" />
        ))}
      </div>
      <div className="absolute p-5 inset-0  flex justify-between  items-center">
        <button
          onClick={prevImgae}
          className="bg-white text-green-500 p-1 rounded-full
           hover:text-white hover:bg-green-500 transition-all ease-in-out "
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="bg-white text-green-500 p-1 rounded-full
           hover:text-white hover:bg-green-500 transition-all ease-in-out "
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`
              transition-all w-3 h-3 bg-white rounded-full
              ${curr === i ? "p-2" : "bg-opacity-50"}
            `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Carousel;
