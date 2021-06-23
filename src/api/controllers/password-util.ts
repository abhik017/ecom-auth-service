const SALT_ROUNDS: number = 10;
import bcrypt = require("bcrypt");

export async function hashPassword(rawPassword: string) {
    return await bcrypt.hash(rawPassword, SALT_ROUNDS);
}

export async function comparePassword(inputPassword: string, hashedFetchedPassword: string) {
    return await bcrypt.compare(inputPassword, hashedFetchedPassword);
}