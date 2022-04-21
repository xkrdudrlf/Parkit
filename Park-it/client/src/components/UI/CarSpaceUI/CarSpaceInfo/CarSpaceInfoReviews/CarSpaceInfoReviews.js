import classes from "./CarSpaceInfoReviews.module.css";

import { Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const CarSpaceInfoReviews = ({ modalContext }) => {
  const displayReviewsHandler = () => {
    modalContext.openPage("/reviews");
  };

  return (
    <div className={classes["review-container"]}>
      <div className={classes["ratings"]}>
        <StarIcon color="yellow" fontSize="medium" />
        <Typography
          variant="carSpaceModalSubContent"
          className={classes.avgRating}
        >
          {modalContext.carSpaceInfo.avg_rating
            ? `${modalContext.carSpaceInfo.avg_rating} /5`
            : ""}
        </Typography>
        <Typography
          variant="carSpaceModalSubContent"
          className={classes["review-link"]}
          onClick={displayReviewsHandler}
        >
          {modalContext.carSpaceInfo.n_ratings
            ? `View ${modalContext.carSpaceInfo.n_ratings} reviews`
            : "No reviews"}
        </Typography>
      </div>
    </div>
  );
};

export default CarSpaceInfoReviews;
