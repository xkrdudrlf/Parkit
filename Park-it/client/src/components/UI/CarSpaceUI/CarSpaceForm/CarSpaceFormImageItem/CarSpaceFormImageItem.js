import classes from "./CarSpaceFormImageItem.module.css";

import { useState } from "react";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import CarSpaceImage from "../../CarSpaceInfo/CarSpaceInfoImage/CarSpaceImage";

const CarSpaceFormImageItem = ({ id, imgSrc, onDelete }) => {
  const [isDeleteIconVisible, setIsDeleteIconVisible] = useState("hidden");

  const imageMouseEnterHandler = (e) => {
    setIsDeleteIconVisible("visible");
  };

  const imageMouseLeaveHandler = (e) => {
    setIsDeleteIconVisible("hidden");
  };

  return (
    <CarSpaceImage
      src={imgSrc}
      alt="car-space"
      onMouseEnter={imageMouseEnterHandler}
      onMouseLeave={imageMouseLeaveHandler}
    >
      <DeleteOutlineIcon
        className={classes["delete-icon"]}
        fontSize="large"
        sx={{ visibility: isDeleteIconVisible }}
        onClick={onDelete}
        data-imagenum={id}
      />
    </CarSpaceImage>
  );
};

export default CarSpaceFormImageItem;
