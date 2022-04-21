import classes from "./AccountDetailsCard.module.css";

const AccountDetailsFormCard = ({ onSubmit, children }) => {
  return (
    <form className={classes.body} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default AccountDetailsFormCard;
