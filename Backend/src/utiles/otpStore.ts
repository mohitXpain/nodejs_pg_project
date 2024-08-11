import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
 

dotenv.config({path: './src/.env'});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = (email: string, otp: string): Promise<void> => {
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


