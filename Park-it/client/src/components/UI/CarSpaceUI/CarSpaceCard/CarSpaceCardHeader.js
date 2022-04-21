import { IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import classes from "./CarSpaceCardHeader.module.css";

const CarSpaceCardHeader = ({ title, onClose, onBack, children }) => {
  return (
    <div className={classes.header}>
      <div className={classes["header-title"]}>
        <div className={classes.content}>
          {onBack && (
            <IconButton
              size="large"
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
        <IconButton size="large" onClick={onClose}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </div>
      {children}
    </div>
  );
};

export default CarSpaceCardHeader;
