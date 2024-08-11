"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(userData, res) {
    const payload = {
        userId: userData.id,
        name: userData.name,
        email: userData.email
    };
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('JWT secret is not defined');
        return res.status(500).json({ error: 'JWT secret is not defined' });
    }
    const token = jsonwebtoken_1.default.sign(payload, jwtSecret);
    res.cookie('jwtToken', token, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(200).json({ message: "Login successful", token: token });
}
