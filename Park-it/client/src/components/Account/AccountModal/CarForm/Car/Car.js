import classes from "./Car.module.css";

import { useContext } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import NumbersIcon from "@mui/icons-material/Numbers";
import { Button, CircularProgress, Icon } from "@mui/material";

import GeneralModalHeader from "../../../../UI/GeneralModal/GeneralModalHeader";
import GeneralModalContent from "../../../../UI/GeneralModal/GeneralModalContent";
import InputField from "../../../../UI/InputField/InputField";
import InputContainer from "../../../../UI/InputContainer/InputContainer";
import GeneralModalActions from "../../../../UI/GeneralModal/GeneralModalActions";
import AccountModalContext from "../../../../../contexts/account-modal-context";

const Car = ({
  manufacturer,
  model,
  year,
  colour,
  registrationNumber,
  actions,
  onSubmit,
  readOnly = true,
  title,
}) => {
  const accountModalContext = useContext(AccountModalContext);

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <GeneralModalHeader
        title={title}
        onClose={accountModalContext.closeModal}
      />
      <GeneralModalContent>
        <div className={classes.inputs}>
          <InputContainer>
            <Icon variant="form" fontSize="large" component={WarehouseIcon} />
            <InputField
              inputClassName={classes.input}
              label="Manufacturer"
              type="text"
              name="manufacturer"
              value={manufacturer.value}
              onChange={manufacturer.onChange}
              readOnly={readOnly}
            />
          </InputContainer>
          <InputContainer>
            <Icon
              variant="form"
              fontSize="large"
              component={DirectionsCarIcon}
            />
            <InputField
              inputClassName={classes.input}
              label="Model"
              type="text"
              name="model"
              value={model.value}
              onChange={model.onChange}
              readOnly={readOnly}
            />
          </InputContainer>
        </div>
        <div className={classes.inputs}>
          <InputContainer>
            <Icon variant="form" fontSize="large" component={AccessTimeIcon} />
            <InputField
              inputClassName={classes.input}
              label="Year"
              type="number"
              name="year"
              value={year.value}
              onChange={year.onChange}
              readOnly={readOnly}
            />
          </InputContainer>
          <InputContainer>
            <Icon variant="form" fontSize="large" component={ColorLensIcon} />
            <InputField
              inputClassName={classes.input}
              label="Colour"
              type="text"
              name="colour"
              value={colour.value}
              onChange={colour.onChange}
              readOnly={readOnly}
            />
          </InputContainer>
        </div>
        <div className={classes.inputs}>
          <InputContainer>
            <Icon variant="form" fontSize="large" component={NumbersIcon} />
            <InputField
              inputClassName={classes.input}
              label="Registration Number"
              type="text"
              name="registrationNumber"
              value={registrationNumber.value}
              onChange={registrationNumber.onChange}
              readOnly={readOnly}
            />
          </InputContainer>
        </div>
      </GeneralModalContent>
      <GeneralModalActions>
        {actions.map((action) => {
          return (
            <Button
              className={classes.btn}
              key={action.content}
              variant="contained"
              size="large"
              type={action.type}
              disabled={action.disabled}
              onClick={action.onClick}
              color={action.color}
            >
              {action.isLoading ? <CircularProgress /> : action.content}
            </Button>
          );
        })}
      </GeneralModalActions>
    </form>
  );
};

export default Car;
