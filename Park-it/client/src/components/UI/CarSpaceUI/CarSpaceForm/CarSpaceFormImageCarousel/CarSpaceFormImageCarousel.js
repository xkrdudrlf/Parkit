import CarSpaceImageCarousel from "../../CarSpaceInfo/CarSpaceInfoImageCarousel/CarSpaceImageCarousel";
import CarSpaceFormImageItem from "../CarSpaceFormImageItem/CarSpaceFormImageItem";

const CarSpaceFormImageCarousel = ({ images, onDeleteImage = () => {} }) => {
  return (
    <CarSpaceImageCarousel>
      {images.map((imgSrc, idx) => (
        <CarSpaceFormImageItem
          key={idx}
          id={idx}
          imgSrc={"data:image/png;base64, " + imgSrc}
          onDelete={onDeleteImage}
        />
      ))}
    </CarSpaceImageCarousel>
  );
};

export default CarSpaceFormImageCarousel;
