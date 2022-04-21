import LoginSignupSuccessModal from "../LoginSignupSuccess/LoginSignupSuccessModal";

const SignupSuccess = ({ onClose }) => {
  return (
    <LoginSignupSuccessModal
      title={"Thank you"}
      buttonContent={"OK"}
      onClose={onClose}
    >
      <p>
        Your signup request has been successfully sent to our server. Please
        check a verification email sent to the email you registered for the
        account.
      </p>
      <p>
        It normally take 3 ~ 5 business days until the account registration
        after the date you've verify your account.
      </p>
    </LoginSignupSuccessModal>
  );
};

export default SignupSuccess;
