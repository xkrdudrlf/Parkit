import classes from "./GeneralModalHeader.module.css";

import { IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const GeneralModalHeader = ({ title, onClose }) => {
  return (
    <div className={classes.header}>
      <Typography variant="modalTitle" color="textSecondary" fontWeight="Bold">
        {title}
      </Typography>
      <IconButton size="small" onClick={onClose}>
        <CloseIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default GeneralModalHeader;
