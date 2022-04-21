import { Modal, Paper } from "@mui/material";

const GeneralModal = ({
  open,
  onClose,
  height,
  width,
  flexDirection,
  children,
  className,
  size = "large",
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        style={{
          height: height,
          width: width,
          flexDirection: flexDirection,
        }}
        className={`${className}`}
        variant={`${size}Modal`}
      >
        {children}
      </Paper>
    </Modal>
  );
};

export default GeneralModal;
