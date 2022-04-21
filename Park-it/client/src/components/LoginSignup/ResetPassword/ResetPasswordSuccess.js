import LoginSignupSuccessModal from "../LoginSignupSuccess/LoginSignupSuccessModal";

const ResetPasswordSuccess = ({ onClose }) => {
  return (
    <LoginSignupSuccessModal
      title={"Thank you"}
      buttonContent={"OK"}
      onClose={onClose}
    >
      <p>
        Your password has been successfully reset. Now you can login with the
        new password.
      </p>
    </LoginSignupSuccessModal>
  );
};

export default ResetPasswordSuccess;
