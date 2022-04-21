import classes from "./Consumer.module.css";

import { ConsumerModalContextProvider } from "../../contexts/consumer-modal-context";
import { SubModalContextProvider } from "../../contexts/submodal-context";

import ConsumerView from "./ConsumerView/ConsumerView";
import ConsumerModal from "./ConsumerModal/ConsumerModal";

const Consumer = () => {
  return (
    <ConsumerModalContextProvider>
      <div className={classes.body}>
        <SubModalContextProvider>
          <ConsumerModal />
          <ConsumerView />
        </SubModalContextProvider>
      </div>
    </ConsumerModalContextProvider>
  );
};

export default Consumer;
