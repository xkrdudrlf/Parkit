import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SubModalContext = React.createContext({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
  closeAllModals: () => {},
  content: { title: "", messages: [], actions: [] },
});

export const SubModalContextProvider = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState({
    title: "",
    messages: [],
    actions: [],
  });
  const [externalModalContext, setExternalModalContext] = useState(null);
  const navigate = useNavigate();

  const closeModal = () => {
    setIsOpen(false);

    if (externalModalContext) externalModalContext.closeModal();

    setExternalModalContext(null);
    setContent({ title: "", messages: [], actions: [] });
  };

  const closeAllModals = (context, redirectPath = null) => {
    return () => {
      setIsOpen(false);
      context.closeModal();
      if (redirectPath) navigate(redirectPath);
    };
  };

  const openModal = ({ title, messages, actions, context = null }) => {
    setIsOpen(true);
    setContent({ title, messages, actions });

    if (context) setExternalModalContext(context);
  };

  const contextValue = {
    isOpen,
    openModal,
    closeModal,
    closeAllModals,
    content,
  };

  return (
    <SubModalContext.Provider value={contextValue}>
      {props.children}
    </SubModalContext.Provider>
  );
};

export default SubModalContext;
