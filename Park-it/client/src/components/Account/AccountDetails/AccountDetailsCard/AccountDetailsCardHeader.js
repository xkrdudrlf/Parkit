import classes from "./AccountDetailsCardHeader.module.css";

const AccountDetailsCardHeader = ({ children }) => {
  return <div className={classes.header}>{children}</div>;
};

export default AccountDetailsCardHeader;
