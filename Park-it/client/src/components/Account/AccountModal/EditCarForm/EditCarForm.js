import { useContext, useState } from "react";

import * as config from "../../../../config";
import * as utility from "../../../../utility";

import AccountModalContext from "../../../../contexts/account-modal-context";
import SubModalContext from "../../../../contexts/submodal-context";

import CarForm from "../CarForm/CarForm";

const EditCarForm = () => {
  const accountModalContext = useContext(AccountModalContext);
  const subModalContext = useContext(SubModalContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteHandler = async () => {
    try {
      const authToken = localStorage.getItem("parkItAuthToken");
      if (!authToken) return;

      const url = `${config.SERVER_URL}/api/consumer/vehicle/${accountModalContext.content.id}`;
      const options = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
      };
      const response = await utility.sendRequest(url, options, setIsDeleting);

      if (!response.status || response.status >= 300)
        throw Error(config.NETWORK_ERROR_MESSAGE);

      subModalContext.openModal({
        title: "Success",
        messages: ["A car information has been successfully deleted."],
        actions: [
          {
            color: "primary",
            onClick: subModalContext.closeAllModals(accountModalContext),
            content: "OK",
            width: "120px",
          },
        ],
        context: accountModalContext,
      });

      accountModalContext.togglePageRefreshStatus();
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

  const editCarHandler = async (formData) => {
    try {
      const authToken = localStorage.getItem("parkItAuthToken");
      if (!authToken) return;

      const url = `${config.SERVER_URL}/api/consumer/vehicle/${accountModalContext.content.id}`;
      const options = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: formData,
      };
      const response = await utility.sendRequest(url, options, setIsEditing);

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
        messages: ["A car information has been successfully edited."],
        actions: [
          {
            color: "primary",
            onClick: subModalContext.closeAllModals(accountModalContext),
            content: "OK",
            width: "120px",
          },
        ],
        context: accountModalContext,
      });

      accountModalContext.togglePageRefreshStatus();
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
    <CarForm
      title="Edit Car"
      initialState={{
        isFormValid: true,
        manufacturer: {
          value: accountModalContext.content.carMake,
          isValid: true,
        },
        model: { value: accountModalContext.content.carModel, isValid: true },
        year: { value: accountModalContext.content.carYear, isValid: true },
        colour: { value: accountModalContext.content.carColour, isValid: true },
        registrationNumber: {
          value: accountModalContext.content.carRego,
          isValid: true,
        },
      }}
      onSubmit={editCarHandler}
      actions={[
        {
          type: "submit",
          content: "Edit",
          isLoading: isEditing,
          isDisable: true,
        },
        {
          color: "warning",
          content: "Delete",
          isLoading: isDeleting,
          isDisable: false,
          onClick: deleteHandler,
        },
      ]}
    />
  );
};

export default EditCarForm;
