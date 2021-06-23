import express = require("express");
import userDetails from "../models/signup-model";
import sendVerificationCodeEmail from "./mail-util";
import httpStatus = require("http-status");
export class ResendVerificationCode {
    public async resendOtp(request: express.Request, response: express.Response) {
        try {
            const accountInfo = request.body;
            const accountEmail = accountInfo.email;
            const obj = userDetails.findOne({email: accountEmail}, (err: any, obj: any) => {
                if(err) {
                    console.log(err);
                    throw "Could not find the account with the following email!";
                } else {
                    return obj;
                }
            });
            if(obj.isVerified) {
                throw "The account is already verified!";
            }
            const newVerificationCode: string = Math.floor((Math.random() * 1000000) + 1).toString();
            userDetails.updateOne({email: accountEmail}, {
                verificationCode: newVerificationCode.toString(),
                expiryTime: this.getExpiryTime()
            })
            .then(() => {
                sendVerificationCodeEmail(obj.fullName, accountEmail, newVerificationCode);
                response.status(httpStatus.OK).send();
            });            
        } catch(err) {
            response.status(400).send("This is an invalid request" + err.toString());
        }
    }
    
    private getExpiryTime() {
        const time = new Date().getTime() / 1000;
        return (time + 300);
    }
}