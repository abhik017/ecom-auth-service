import apiControllersFactory = require("../../controller-factory");
import express = require("express");

export function routes(app: express.Express) {
    const { signupController, accountVerificationController, resendVerificationCodeController, loginController } = apiControllersFactory.getApiControllers();
    app.route("/v0/signup").post((req, res) => signupController.signup(req, res));
    app.route("/v0/verify-account").post((req, res) => accountVerificationController.verifyCode(req, res));
    app.route("/v0/resend-verification-code").post((req, res) => resendVerificationCodeController.resendOtp(req, res));
    app.route("/v0/login").post((req, res) => loginController.login(req, res));
}