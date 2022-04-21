import classes from "./GeneralModalContent.module.css";

const GeneralModalContent = ({ children, className, direction = "column" }) => {
  const styleDirection = direction === "column" ? classes.vertical : "";

  return (
    <div className={`${styleDirection} ${classes.content} ${className}`}>
      {children}
    </div>
  );
};

export default GeneralModalContent;
