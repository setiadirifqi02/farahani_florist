import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import { Link as routerLink } from "react-router-dom";

const CardCompOne = ({ imagUrl, title, desc, url }) => {
  return (
    <Card
      className="feature-card__container col-span-12 sm:col-span-4 h-[300px]"
      isPressable
      shadow="none"
      as={routerLink}
      to={url}
    >
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover"
        src={imagUrl}
      />
      <CardFooter className="absolute z-10 bottom-1 flex-col !items-start">
        <p className="text-tiny font-poppins text-black/60 uppercase font-bold">
          {title}
        </p>
        <h4 className="font-poppins text-large">{desc}</h4>
      </CardFooter>
    </Card>
  );
};
export default CardCompOne;
