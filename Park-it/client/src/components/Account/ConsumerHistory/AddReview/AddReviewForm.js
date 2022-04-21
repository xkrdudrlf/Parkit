import { useState } from "react";

import * as config from "../../../../config";
import * as utility from "../../../../utility";
import classes from "./AddReviewForm.module.css";
import GeneralModalHeader from "../../../UI/GeneralModal/GeneralModalHeader";
import GeneralModalContent from "../../../UI/GeneralModal/GeneralModalContent";
import GeneralModalActions from "../../../UI/GeneralModal/GeneralModalActions";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import RateReviewIcon from "@mui/icons-material/RateReview";
import InputField from "../../../UI/InputField/InputField";
import Rating from "@mui/material/Rating";
import {
  Button,
  CircularProgress,
  Icon,
  Divider,
  Typography,
} from "@mui/material";

const AddReviewForm = ({ context, subModalContext }) => {
  const [isAdding, setIsAdding] = useState(false);

  // Values from the form
  const [ratings, setRatings] = useState("");
  const [review, setReview] = useState("");

  const [validRatings, setValidRatings] = useState(false);
  const [validReview, setValidReview] = useState(false);

  const changeRatings = (e) => {
    const ratings = e.target.value;
    setRatings(ratings);
    setValidRatings(ratings !== "");
  };

  const changeReview = (e) => {
    const review = e.target.value;
    setReview(review);
    setValidReview(review !== "");
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem("parkItAuthToken");
      if (!authToken) return;
      const url = `${config.SERVER_URL}/api/consumer/review`;
      const options = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: {
          parkingSpace: context.content.carSpaceId,
          consumer: context.content.consumer,
          rating: ratings,
          comment: review,
        },
      };
      const response = await utility.sendRequest(url, options, setIsAdding);
      if (!response.status) throw Error(config.NETWORK_ERROR_MESSAGE);
      if (response.status >= 300) {
        const errorMsgs = [];
        for (const key of Object.keys(response.data)) {
          errorMsgs.push(` - Not a valid ${key}.`);
        }
        throw Error(errorMsgs);
      }

      subModalContext.openModal({
        title: "Success",
        messages: ["You have successfully made a review"],
        actions: [
          {
            color: "primary",
            onClick: subModalContext.closeAllModals(context),
            content: "OK",
            width: "120px",
          },
        ],
        context: context,
      });

      context.togglePageRefreshStatus();
    } catch (e) {
      subModalContext.openModal({
        title: "Error",
        messages: e.message.split(","),
        actions: [
          {
            color: "primary",
            onClick: subModalContext.closeModal,
            content: "OK",
            width: "120px",
          },
        ],
      });
    }
  };

  return (
    <form className={classes.form} onSubmit={submitFormHandler}>
      <GeneralModalHeader title="Add Review" onClose={context.closeModal} />
      <Divider className={classes.titleDivider} />
      <GeneralModalContent>
        <div className={classes.inputs}>
          <div className={classes.inputContainer}>
            <Typography component="legend" variant="carSpaceModalSubTitle">
              Ratings
            </Typography>
            <div className={classes.sameRowContainer}>
              <Icon
                variant="form"
                fontSize="large"
                component={StickyNote2Icon}
              />
              <Rating
                name="size-medium"
                onChange={changeRatings}
                precision={0.5}
              />
            </div>
          </div>
          <div>
            <Typography component="legend" variant="carSpaceModalSubTitle">
              Review
            </Typography>
            <Icon variant="form" fontSize="large" component={RateReviewIcon} />
            <InputField
              inputClassName={classes.input}
              label="Review"
              type="text"
              name="review"
              multiline={true}
              maxRows={8}
              minRows={3}
              onChange={changeReview}
            />
          </div>
        </div>
      </GeneralModalContent>
      <GeneralModalActions>
        <Button
          variant="contained"
          type="submit"
          size="large"
          disabled={!(validRatings && validReview)}
          className={classes.btn}
        >
          {isAdding ? <CircularProgress size="1.5rem" /> : "Submit"}
        </Button>
      </GeneralModalActions>
    </form>
  );
};

export default AddReviewForm;
