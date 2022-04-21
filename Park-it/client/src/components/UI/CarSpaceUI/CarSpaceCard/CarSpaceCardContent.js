import classes from "./CarSpaceCardContent.module.css";

const CarSpaceCardContent = ({ children, className }) => {
  return <div className={`${classes.body} ${className}`}>{children}</div>;
};

export default CarSpaceCardContent;
