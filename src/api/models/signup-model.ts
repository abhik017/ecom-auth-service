import mongoose from "mongoose";

const Schema = mongoose.Schema;

const signupModel = new Schema({
    fullName: String,
    email: String,
    accountPassword: String,
    isVerified: Boolean,
    verificationCode: String,
    expiryTime: Number,
    role: String // "vendor" or "customer"
});

const userDetails = mongoose.model("signupModel", signupModel);

export default userDetails;
