import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userModel = new Schema({
    fullName: String,
    email: String,
    accountPassword: String,
    isVerified: Boolean,
    verificationCode: String,
    expiryTime: Number,
    role: String,
    accountBalance: Number // "vendor" or "customer"
});

const userDetails = mongoose.model("userModel", userModel);

export default userDetails;
