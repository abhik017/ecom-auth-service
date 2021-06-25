import express = require("express");
import userDetails from "../models/user-model";
import sendVerificationCodeEmail from "./mail-util";
import httpStatus = require("http-status");
export class ResendVerificationCode {
    public async resendOtp(request: express.Request, response: express.Response) {
        try {
            const accountInfo = request.body;
            const accountEmail = accountInfo.email;
            const userInfo = await userDetails.findOne({email: accountEmail});
            if(userInfo.isVerified) {
                response.status(httpStatus.BAD_REQUEST).send("The account is already verified!");
                return ;
            }
            const newVerificationCode: string = Math.floor((Math.random() * 1000000) + 1).toString();
            await userDetails.updateOne({email: accountEmail}, {
                verificationCode: newVerificationCode.toString(),
                expiryTime: this.getExpiryTime()
            });
            await sendVerificationCodeEmail(userInfo.fullName, accountEmail, newVerificationCode);
            response.status(httpStatus.OK).send("Email containing verification code has been sent. If you did not recieve the email, please try again!");   
        } catch(err) {
            console.log(err);
            response.status(httpStatus.BAD_REQUEST).send("This is an invalid request!");
        }
    }
    private getExpiryTime() {
        const time = new Date().getTime() / 1000;
        return (time + 300);
    }
}