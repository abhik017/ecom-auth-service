import userDetails from "../models/user-model";
import sendVerificationCodeEmail from "./mail-util";
import httpStatus = require("http-status");
import express = require("express");
import { hashPassword } from "./password-util";

export class SignupController {
    public async signup(request: express.Request, response: express.Response) {
        try {
            const accountInfo: any = request.body;
            const accountEmail: string = accountInfo.email;
            const accountName: string = accountInfo.fullName;
            const accountPassword: string = accountInfo.password;
            const accountRole: string = accountInfo.role;
            const hashedPassword: string = await hashPassword(accountPassword);
            if(!accountEmail || !accountName || !accountPassword || !accountRole ) {
                throw "The fields are empty!";
            }
            const alreadyExists = await userDetails.findOne({email: accountEmail});
            if( alreadyExists ) {
                throw "This email id is already in use!";
            }
            this.validatePassword(accountPassword);
            const verificationCode: string = Math.floor((Math.random() * 1000000) + 1).toString();
            const dbData = new userDetails({
                fullName: accountName,
                email: accountEmail,
                accountPassword: hashedPassword,
                isVerified: false,
                verificationCode: verificationCode,
                expiryTime: this.getExpiryTime(),
                role: accountRole,
                accountBalance: 0
            });
            await dbData.save();
            console.log("New account details stored in database!");
            await sendVerificationCodeEmail(accountName, accountEmail, verificationCode)
            response.status(httpStatus.CREATED)
            .send("Account creation successful and email containing the verification code has been sent. If you did not recieve the email, please try again!");
        } catch(err) {
            response.status(httpStatus.BAD_REQUEST).send("This is an invalid request!" + err.toString());
        }
    }

    private validatePassword(password: string) {
        if(password.length < 8) {
            throw "Password must be of minimum length 8 characters!";
        }
    }

    private getExpiryTime() {
        const time = new Date().getTime() / 1000;
        return (time + 300);
    }
}