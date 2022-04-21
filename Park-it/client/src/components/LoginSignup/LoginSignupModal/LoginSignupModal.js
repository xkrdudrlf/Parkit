import { useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LoginSignupModalContext from "../../../contexts/login-signup-modal-context";

import GeneralModal from "../../UI/GeneralModal/GeneralModal";
import ForgotPasswordForm from "../ForgotPassword/ForgotPasswordForm";
import ForgotPasswordFormSuccess from "../ForgotPassword/ForgotPasswordFormSuccess";
import LoginForm from "../Login/LoginForm";
import ResetPasswordForm from "../ResetPassword/ResetPasswordForm";
import ResetPasswordSuccess from "../ResetPassword/ResetPasswordSuccess";
import SignupForm from "../Signup/SignupForm";
import SignupSuccess from "../Signup/SignupSuccess";

const LoginSignupModal = () => {
  const location = useLocation();
  const loginSignupModalContext = useContext(LoginSignupModalContext);
  const onClose = loginSignupModalContext.closeModal;

  return (
    <GeneralModal
      open={loginSignupModalContext.isOpen}
      onClose={loginSignupModalContext.closeModal}
      flexDirection="column"
      size={location.pathname === "/signup" ? "medium" : "message"}
    >
      <Routes>
        <Route path="login" element={<LoginForm onClose={onClose} />} />
        <Route path="signup" element={<SignupForm onClose={onClose} />} />
        <Route
          path="signupSuccess"
          element={<SignupSuccess onClose={onClose} />}
        />
        <Route
          path="forgotPassword"
          element={<ForgotPasswordForm onClose={onClose} />}
        />
        <Route
          path="passwordResetEmailSent"
          element={<ForgotPasswordFormSuccess onClose={onClose} />}
        />
        <Route
          path="dj-rest-auth/password/reset/confirm/:uid/:token"
          element={<ResetPasswordForm onClose={onClose} />}
        />
        <Route
          path="resetPasswordSuccess"
          element={<ResetPasswordSuccess onClose={onClose} />}
        />
      </Routes>
    </GeneralModal>
  );
};

export default LoginSignupModal;
