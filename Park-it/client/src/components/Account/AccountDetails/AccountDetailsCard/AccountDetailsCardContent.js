import classes from "./AccountDetailsCardContent.module.css";

const AccountDetailsCardContent = ({ children }) => {
  return <div className={classes.content}>{children}</div>;
};

export default AccountDetailsCardContent;
