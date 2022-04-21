const LoginSignupModalContent = ({ children, className }) => {
  return (
    <div
      style={{
        flex: 1,
        marginTop: "30px",
        display: "flex",
        flexDirection: "column",
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default LoginSignupModalContent;
