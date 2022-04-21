import classes from "./CarSpaceFormSubModal.module.css";

import GeneralModal from "../../../GeneralModal/GeneralModal";
import GeneralModalHeader from "../../../GeneralModal/GeneralModalHeader";
import GeneralModalContent from "../../../GeneralModal/GeneralModalContent";
import GeneralModalActions from "../../../GeneralModal/GeneralModalActions";

import { Button, Typography } from "@mui/material";

const CarSpaceFormSubModal = ({
  open,
  onClickOk = null,
  onClose,
  title,
  content,
}) => {
  return (
    <GeneralModal open={open} onClose={onClose} size="message">
      <GeneralModalHeader title={title} onClose={onClose} />
      <GeneralModalContent className={classes.content}>
        {content.map((message) => {
          return (
            <Typography
              key={message}
              variant="modalContent"
              className={classes["content-item"]}
            >
              {message}
            </Typography>
          );
        })}
      </GeneralModalContent>
      <GeneralModalActions>
        {onClickOk && (
          <>
            <Button
              size="large"
              variant="contained"
              className={classes.btn}
              onClick={onClickOk}
            >
              OK
            </Button>
            <Button
              size="large"
              variant="contained"
              color="warning"
              className={classes.btn}
              onClick={onClose}
            >
              Cancel
            </Button>
          </>
        )}
        {!onClickOk && (
          <Button
            size="large"
            variant="contained"
            className={classes.btn}
            onClick={onClose}
          >
            OK
          </Button>
        )}
      </GeneralModalActions>
    </GeneralModal>
  );
};

export default CarSpaceFormSubModal;
