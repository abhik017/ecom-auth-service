import { LoginController } from './api/controllers/login-controller';
import { ResendVerificationCode } from './api/controllers/resend-verification-code-controller';
import { SignupController } from "./api/controllers/signup-controller";
import { AccountVerificationController } from "./api/controllers/account-verification-controller";
export function getApiControllers() {
    const signupController: SignupController = new SignupController();
    const accountVerificationController: AccountVerificationController = new AccountVerificationController();
    const resendVerificationCodeController: ResendVerificationCode = new ResendVerificationCode();
    const loginController: LoginController = new LoginController();
    return {
        signupController,
        accountVerificationController,
        resendVerificationCodeController,
        loginController
    }
}