import classes from "./GeneralModalActions.module.css";

const GeneralModalActions = ({ children }) => {
  return <div className={classes.actions}>{children}</div>;
};

export default GeneralModalActions;
