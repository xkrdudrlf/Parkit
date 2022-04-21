import { useContext, useState } from "react";

import * as config from "../../../../config";
import * as utility from "../../../../utility";

import AccountModalContext from "../../../../contexts/account-modal-context";
import SubModalContext from "../../../../contexts/submodal-context";

import CarForm from "../CarForm/CarForm";

const AddCarForm = () => {
  const accountModalContext = useContext(AccountModalContext);
  const subModalContext = useContext(SubModalContext);
  const [isAdding, setIsAdding] = useState(false);

  const submitFormHandler = async (formData) => {
    try {
      const authToken = localStorage.getItem("parkItAuthToken");
      if (!authToken) return;
      const url = `${config.SERVER_URL}/api/consumer/vehicle`;
      const options = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: formData,
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
        messages: [
          "A car has been successfully registered under your account.",
        ],
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
      title="Add Car"
      onSubmit={submitFormHandler}
      actions={[
        {
          type: "submit",
          content: "Add",
          isLoading: isAdding,
          isDisable: true,
        },
      ]}
    />
  );
};

export default AddCarForm;
