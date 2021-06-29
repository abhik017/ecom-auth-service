import express from "express";
import userDetails from "../models/user-model";
import { comparePassword } from "./password-util";
import jwt = require("jsonwebtoken");
import httpStatus = require("http-status");

export class LoginController {
    public async login(request: express.Request, response: express.Response) {
        try {
            const inputAccountInfo = request.body;
            const password = inputAccountInfo && inputAccountInfo.password;
            const email = inputAccountInfo && inputAccountInfo.email;
            const fetchedAccountInfo = await userDetails.findOne({email: email});
            const isAuthorized: boolean = fetchedAccountInfo && await comparePassword(password, fetchedAccountInfo.accountPassword) && fetchedAccountInfo.isVerified;
            if( !isAuthorized ) {
                console.log("Either the account is not verified or the email/password is invalid!");
                response.status(httpStatus.UNAUTHORIZED).send("Either the account is not verified or the email/password is invalid!");
            } else {
                const accessToken = await this.signAccessToken(email, fetchedAccountInfo.role);
                const refreshToken = await this.signRefreshToken(email, fetchedAccountInfo.role);
                response.status(httpStatus.OK).send({ 
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    role: fetchedAccountInfo.role
                });
            }
        } catch(err) {
            console.log(err);
            response.status(httpStatus.UNAUTHORIZED).send(err.toString() + " Invalid credentials!");
        }
    }

    private async signAccessToken(userEmail: string, userRole: string) {
        return new Promise((resolve, reject) => {
            const payload = {
                role: userRole // "vendor" or "customer"
            };
            const secret: string = process.env.ACCESS_TOKEN_SECRET as string;
            const options = {
                expiresIn: "10m",
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

    private async signRefreshToken(userEmail: string, userRole: string) {
        return new Promise((resolve, reject) => {
            const payload = {
                role: userRole // "vendor" or "customer"
            };
            const secret: string = process.env.REFRESH_TOKEN_SECRET as string;
            const options = {
                expiresIn: "365d",
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
}