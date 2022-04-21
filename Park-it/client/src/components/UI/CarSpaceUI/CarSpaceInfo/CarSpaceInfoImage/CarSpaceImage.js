import classes from "./CarSpaceImage.module.css";

const CarSpaceImage = ({ src, alt, children, onMouseEnter, onMouseLeave }) => {
  return (
    <div className={classes.image}>
      <img
        src={src}
        alt={alt}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      {children}
    </div>
  );
};

export default CarSpaceImage;
