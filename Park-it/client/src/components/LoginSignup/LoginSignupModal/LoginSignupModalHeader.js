import { IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import classes from "./LoginSignupModalHeader.module.css";

const LoginSignupModalHeader = ({ title, onClose, onBack }) => {
  return (
    <div className={classes.loginModalHeader}>
      <div className={classes.loginModalHeader__body}>
        {onBack && (
          <IconButton
            size="small"
            onClick={onBack}
            className={classes.loginModalHeader_btn}
          >
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
        )}
        <Typography
          variant="modalTitle"
          color="textSecondary"
          fontWeight="Bold"
        >
          {title}
        </Typography>
      </div>

      <IconButton
        size="small"
        onClick={onClose}
        className={classes.loginModalHeader_btn}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default LoginSignupModalHeader;
