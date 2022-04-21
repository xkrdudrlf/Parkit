import { useContext, useReducer } from "react";

import AuthContext from "../../../../contexts/auth-context";
import {
  carFormInitialState,
  carFormReducer,
} from "../../../../reducers/car-form-reducer";

import Car from "./Car/Car";

const CarForm = ({
  title,
  initialState = carFormInitialState(),
  actions,
  onSubmit,
}) => {
  const authContext = useContext(AuthContext);
  const [formState, dispatchFormState] = useReducer(
    carFormReducer,
    initialState
  );

  const submitFormHandler = (e) => {
    e.preventDefault();

    const formData = {
      user: authContext.userInfo.pk,
      carMake: formState.manufacturer.value,
      carModel: formState.model.value,
      carYear: formState.year.value,
      carColour: formState.colour.value,
      carRego: formState.registrationNumber.value,
    };

    onSubmit(formData);
  };

  const manufacturerChangeHandler = (e) => {
    dispatchFormState({ type: "MANUFACTURER_INPUT", value: e.target.value });
  };
  const modelChangeHandler = (e) => {
    dispatchFormState({ type: "MODEL_INPUT", value: e.target.value });
  };
  const yearChangeHandler = (e) => {
    dispatchFormState({ type: "YEAR_INPUT", value: e.target.value });
  };
  const colourChangeHandler = (e) => {
    dispatchFormState({ type: "COLOUR_INPUT", value: e.target.value });
  };
  const registrationNumberChangeHandler = (e) => {
    dispatchFormState({
      type: "REGISTRATION_NUMBER_INPUT",
      value: e.target.value,
    });
  };

  return (
    <Car
      title={title}
      manufacturer={{
        value: formState.manufacturer.value,
        onChange: manufacturerChangeHandler,
      }}
      model={{ value: formState.model.value, onChange: modelChangeHandler }}
      year={{ value: formState.year.value, onChange: yearChangeHandler }}
      colour={{ value: formState.colour.value, onChange: colourChangeHandler }}
      registrationNumber={{
        value: formState.registrationNumber.value,
        onChange: registrationNumberChangeHandler,
      }}
      onSubmit={submitFormHandler}
      actions={actions.map((action) => {
        return {
          ...action,
          disabled: action.isDisable ? !formState.isFormValid : false,
        };
      })}
    />
  );
};

export default CarForm;
