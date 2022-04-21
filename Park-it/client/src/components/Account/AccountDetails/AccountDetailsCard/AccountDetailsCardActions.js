import classes from "./AccountDetailsCardActions.module.css";

const AccountDetailsCardActions = ({ children }) => {
  return <div className={classes.actions}>{children}</div>;
};

export default AccountDetailsCardActions;
