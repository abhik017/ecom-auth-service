import express = require("express");
import httpStatus = require("http-status");
import userDetails from "../models/signup-model";
export class AccountVerificationController {
    public async verifyCode(request: express.Request, response: express.Response) {
        try {
            const accountInfo = request.body;
            const accountEmail = accountInfo.email;
            const enteredVerificationCode = accountInfo.verificationCode;
            if(!accountEmail || !enteredVerificationCode) {
                throw "The fields are empty!";
            }
            const { verificationCode, expiryTime } = await userDetails.findOne({email: accountEmail}, (err: any, obj: any) => {
                if(err) {
                    console.log(err);
                    throw "Could not find the account with the following email!";
                } else {
                    return obj;
                }
            });
            const time = new Date().getTime() / 1000;
            if(time <= expiryTime && enteredVerificationCode === verificationCode) {
                userDetails.updateOne({email: accountEmail}, {isVerified: true});
                response.status(httpStatus.OK);
                response.send();
            } else {
                console.log("The input verification code is either expired or is incorrect!");
                response.status(httpStatus.UNAUTHORIZED);
                response.send();
            }
        } catch(err) {
            response.status(400).send("This is an invalid request" + err.toString());
        }
    }
}