"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './src/.env' });
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendOtpEmail = (email, otp) => {
    const mailOptions = {
        from: 'BeeFoodie <${process.env.EMAIL_USER}>',
        to: email,
        subject: 'BeeFoodie - Your OTP Code',
        text: `Your OTP code for email verification is ${otp}`,
    };
    return transporter.sendMail(mailOptions).then(() => {
        console.log('OTP sent to', email);
    });
};
exports.sendOtpEmail = sendOtpEmail;
