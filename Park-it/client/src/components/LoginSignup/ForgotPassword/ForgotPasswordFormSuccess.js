import LoginSignupSuccessModal from "../LoginSignupSuccess/LoginSignupSuccessModal";

const ForgotPasswordFormSuccess = ({ onClose }) => {
  return (
    <LoginSignupSuccessModal
      title={"Thank you"}
      buttonContent={"OK"}
      onClose={onClose}
    >
      <p>
        Password reset e-mail has been sent to your email. Please check your
        email and reset your password via the link in the email.
      </p>
    </LoginSignupSuccessModal>
  );
};

export default ForgotPasswordFormSuccess;
