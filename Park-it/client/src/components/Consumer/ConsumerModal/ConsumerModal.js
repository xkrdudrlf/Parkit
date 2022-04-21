import { useContext } from "react";

import ConsumerModalContext from "../../../contexts/consumer-modal-context";
import SubModalContext from "../../../contexts/submodal-context";

import CarSpaceReviews from "../../CarSpaceReviews/CarSpaceReviews";
import GeneralModal from "../../UI/GeneralModal/GeneralModal";
import MessageModal from "../../UI/MessageModal/MessageModal";
import CarSpaceBookingForm from "./CarSpaceBookingForm/CarSpaceBookingForm";
import ConsumerCarSpaceInfo from "./ConsumerCarSpaceInfo/ConsumerCarSpaceInfo";

const ConsumerModal = () => {
  const consumerModalContext = useContext(ConsumerModalContext);
  const subModalContext = useContext(SubModalContext);

  return (
    <GeneralModal
      open={consumerModalContext.isOpen}
      onClose={consumerModalContext.closeModal}
    >
      <MessageModal
        open={subModalContext.isOpen}
        onClose={subModalContext.closeModal}
        title={subModalContext.content.title}
        messages={subModalContext.content.messages}
        actions={subModalContext.content.actions}
      />
      {consumerModalContext.page === "/info" && <ConsumerCarSpaceInfo />}
      {consumerModalContext.page === "/book" && <CarSpaceBookingForm />}
      {consumerModalContext.page === "/reviews" && (
        <CarSpaceReviews modalContext={consumerModalContext}
        subModalContext={subModalContext} />
      )}
    </GeneralModal>
  );
};

export default ConsumerModal;
