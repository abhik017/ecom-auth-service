import express from "express";
import httpStatus = require("http-status");
import userDetails from "../models/user-model";
import sendVerificationCodeEmail from "./mail-util";
import jwt = require("jsonwebtoken");
import { hashPassword } from "./password-util";
export class ForgotPasswordController {
    public async sendVerificationCode(request: express.Request, response: express.Response) {
        try {
            const accountInfo = request.body;
            const email = accountInfo.email;
            if(!accountInfo || !email) {
                throw "Either the input is invalid or is insufficient to process the request!";
            }
            const userInfo = await userDetails.findOne({email: email});
            if(!userInfo) {
                throw "Could not find the account with the provided email id!";
            }
            const verificationCode: string = Math.floor((Math.random() * 1000000) + 1).toString();
            await userDetails.updateOne({email: email}, {verificationCode: verificationCode, expiryTime: this.getExpiryTime()});
            await sendVerificationCodeEmail(userInfo.accountName, userInfo.email, verificationCode);
            response.status(httpStatus.OK).send("Email containing the verification code has been sent. If you did not recieve the email, please try again!");
        } catch(err) {
            console.log(err);
            response.status(httpStatus.BAD_REQUEST).send(err.toString() + " Could not process the request at this moment.")
        }
    }

    public async jwtForChangePassword(request: express.Request, response: express.Response) {
        try {
            const accountInfo = request.body;
            if(!accountInfo || !accountInfo.email || !accountInfo.verificationCode) {
                throw "Either the input is invalid or is insufficient to process the request!";
            }
            const userInfo = await userDetails.findOne({email: accountInfo.email});
            const time = new Date().getTime() / 1000;
            if(!userInfo || userInfo.verificationCode !== accountInfo.verificationCode || userInfo.expiryTime < time) {
                throw "Either the entered details are incorrect or the verification code is expired!";
            }
            const accessToken = await this.signAccessToken(userInfo.email);
            response.status(httpStatus.OK).send({
                accessToken: accessToken
            });
        } catch(err) {
            console.log(err);
            response.status(httpStatus.UNAUTHORIZED).send(err.toString() + " Could not verify you. Try again!")
        }
    }
    
    public async changePassword(request: express.Request, response: express.Response) {
        try {
            const accountInfo = request.body;
            const accessToken = accountInfo.accessToken;
            const accountPassword = accountInfo.password;
            if(!accountInfo || !accessToken || !accountPassword) {
                throw "Either the input is invalid or is insufficient to process the request!";
            }
            this.validatePassword(accountPassword);
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string, async(err, payload) => {
                if(err) {
                    response.status(httpStatus.UNAUTHORIZED).send("The user is unauthorized!");
                } else {
                    const email = payload.aud;
                    const hashedPassword: string = await hashPassword(accountPassword);
                    await userDetails.updateOne({email: email}, {accountPassword: hashedPassword});
                    response.status(httpStatus.OK).send("Password changed successfully!");
                }
            });
        } catch(err) {
            console.log(err);
            response.status(httpStatus.UNAUTHORIZED).send(err.toString() + " Could not process the request. Try again!");
        }
    }

    private getExpiryTime() {
        const time = new Date().getTime() / 1000;
        return (time + 300);
    }

    private async signAccessToken(userEmail: string) {
        return new Promise((resolve, reject) => {
            const payload = {
                
            };
            const secret: string = process.env.ACCESS_TOKEN_SECRET as string;
            const options = {
                expiresIn: "5m",
                issuer: "e-com.com",
                audience: userEmail
            };
            jwt.sign(payload, secret, options, (err: any, token: any) => {
                if(err) {
                    console.log(err);
                    reject("Internal Server Error!");
                }
                resolve(token);
            });
        });
    }

    private validatePassword(password: string) {
        if(password.length < 8) {
            throw "Password must be of minimum length 8 characters!";
        }
    }
}