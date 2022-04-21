import classes from "./MessageModal.module.css";

import { Button, Typography } from "@mui/material";

import GeneralModal from "../GeneralModal/GeneralModal";
import GeneralModalActions from "../GeneralModal/GeneralModalActions";
import GeneralModalContent from "../GeneralModal/GeneralModalContent";
import GeneralModalHeader from "../GeneralModal/GeneralModalHeader";

const MessageModal = ({ open, onClose, title, messages, actions }) => {
  return (
    <GeneralModal open={open} onClose={onClose} size="message">
      <GeneralModalHeader title={title} onClose={onClose} />
      <GeneralModalContent>
        {messages.map((message) => {
          return (
            <Typography
              key={message}
              variant="modalContent"
              className={classes.message}
            >
              {message}
            </Typography>
          );
        })}
      </GeneralModalContent>
      <GeneralModalActions>
        {actions.map((action) => {
          return (
            <Button
              key={action.content}
              size="large"
              variant="contained"
              color={action.color}
              onClick={action.onClick}
              style={{
                width: `${action.width ? action.width : ""}`,
                marginRight: "30px",
              }}
            >
              {action.content}
            </Button>
          );
        })}
      </GeneralModalActions>
    </GeneralModal>
  );
};

export default MessageModal;
