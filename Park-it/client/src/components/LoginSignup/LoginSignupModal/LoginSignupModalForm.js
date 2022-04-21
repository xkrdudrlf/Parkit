const LoginSignupModalForm = ({ className, children, onSubmit }) => {
  return (
    <form
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
      onSubmit={onSubmit}
      className={className}
    >
      {children}
    </form>
  );
};

export default LoginSignupModalForm;
