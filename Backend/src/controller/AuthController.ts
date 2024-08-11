import e, { Request, Response } from "express";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import {sendOtpEmail} from "../utiles/otpStore";
import NodeCache from 'node-cache';
import jwt from 'jsonwebtoken';
import {GetAllUser ,Register, FindUserByName, FindUserByEmail, UpdateOtpverify, GetAllUserbyMySQL, RegisterMySQL, FindUserByEmailMySQL, FindUserByNameMySQL, UpdateOtpverifyMySQL, FindNames} from "../model/UserModel";
import { closePGconnection } from "../config/postgres";
import { closeMySQL } from "../config/mysql";
import { generateToken } from "../services/jwtServices";
import { User, UserData } from "../annotation/userAnnotation";

dotenv.config({path: './src/.env'})


export const fetchUsers = async (req: Request, res: Response) => {
    try {
        const getuser = await GetAllUser();
        res.json(getuser);
    }catch(error){
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }  finally {
        await closePGconnection();
    }
}



const generateOtp = (): string => crypto.randomInt(100000, 999999).toString();
const otpCache = new NodeCache({ stdTTL: 300 });



export const insertUser = async (req: Request, res: Response) => {
    
    const {name, phone, email, password} = req.body as User;

    if (!name || !phone || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        
        const user = await FindUserByName(name);
        const user_email = await FindUserByEmail(email);

        if(user){
            return res.status(400).json({message: "User already exists"})
        }

        if(user_email){
            return res.status(400).json({message: "Email already exists"})
        }

        await Register(name, phone, email, password);

        res.status(200).json({message: "User created successfully"});

    }catch(error){
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to store users" });
    } finally {
        await closePGconnection();
    }
};




export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as User;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await FindUserByEmail(email);
        if (!user) {
            console.log(`User not found for email: ${email}`);
            res.clearCookie('jwtToken', {httpOnly: true, secure: true, sameSite: 'strict'});
            return res.status(400).json({ message: 'User not found' });
        }

        if (password !== user.password) {
            console.log(`Invalid password for email: ${email}`);
            res.clearCookie('jwtToken', {httpOnly: true, secure: true, sameSite: 'strict'});
            return res.status(400).json({ message: 'Incorrect Password.' });
        }

        if(!user.otp_verified){
            const otp = generateOtp();
            otpCache.set(email, otp);
            await sendOtpEmail(email, otp);
            req.session.email = email;
            req.session.user = user;
            return res.status(200).json({ message: "OTP sent to your email" });
        }

        generateToken(user, res);

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Failed to login user" });
    } finally {
        await closePGconnection();
    }
};




export const verifyLogin = async (req: Request, res: Response) => {
    const { otp } = req.body;
    const email = req.session.email;
    const userData = req.session.user as UserData;

    if (!email) {
        return res.status(400).json({ message: 'No email found in session' });
    }

    try {

        const cachedOtp = otpCache.get(email);

        if (!cachedOtp) {
            return res.status(400).json({ message: 'OTP has expired or is invalid' });
        }

        if (cachedOtp === otp) {
            await UpdateOtpverify(email);
            otpCache.del(email); // Optionally, delete the OTP after successful verification
            req.session.email = ''; // Clear the email from session
            req.session.user = null;

            generateToken(userData, res);

        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ error: "Failed to verify OTP" });
    } finally {
        await closePGconnection();
    }
};




export const logout = (req: Request, res: Response) => {
    const token = req.cookies.jwtToken;

    // Check if the JWT token is present
    if (!token) {
        return res.status(400).json({ error: "No active session or already logged out" });
    }

    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ error: "Failed to log out" });
        }

        // Clear the JWT cookie
        res.clearCookie('jwtToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        return res.status(200).json({ message: "Logout successful" });
    });
};





export const fetchUsersMySQL = async (req: Request, res: Response) => {
    try {
        const getuser = await GetAllUserbyMySQL();
        res.json(getuser);
    }catch(error){
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    } finally {
        await closeMySQL();
    }
};






export const insertUserMySQL = async (req: Request, res: Response) => {
    
    const {name, phone, email, password} = req.body as User;

    if (!name || !phone || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        
        const user = await FindUserByNameMySQL(name);
        const user_email = await FindUserByEmailMySQL(email);

        if(user.length > 0){
            return res.status(400).json({message: "User already exists"})
        }

        if(user_email.length > 0){
            return res.status(400).json({message: "Email already exists"})
        }

        await RegisterMySQL(name, phone, email, password);

        res.status(200).json({message: "User created successfully"});

    }catch(error){
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to store users" });
    } finally {
        await closeMySQL();
    }
};




export const loginMySQL = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as User;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await FindUserByEmailMySQL(email);
        if (user.length === 0) {
            console.log(`User not found for email: ${email}`);
            res.clearCookie('jwtToken', {httpOnly: true, secure: true, sameSite: 'strict'});
            return res.status(400).json({ message: 'User not found' });
        }

        const userData = user[0];

        if (password !== userData.password) {
            console.log(`Invalid password for email: ${email}`);
            res.clearCookie('jwtToken', {httpOnly: true, secure: true, sameSite: 'strict'});
            return res.status(400).json({ message: 'Incorrect Password.' });
        }

        if(!userData.otp_verified){
            const otp = generateOtp();
            otpCache.set(email, otp);
            await sendOtpEmail(email, otp);
            req.session.email = email;
            req.session.user = userData;
            return res.status(200).json({ message: "OTP sent to your email" });
        }

        generateToken(userData, res);

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Failed to login user" });
    } finally {
        await closeMySQL();
    }
};




export const verifyLoginMySQL = async (req: Request, res: Response) => {
    const { otp } = req.body;
    const email = req.session.email;
    const userData = req.session.user as UserData;

    if (!email) {
        return res.status(400).json({ message: 'No email found in session' });
    }

    try {

        const cachedOtp = otpCache.get(email);

        if (!cachedOtp) {
            return res.status(400).json({ message: 'OTP has expired or is invalid' });
        }

        if (cachedOtp === otp) {
            await UpdateOtpverifyMySQL(email);
            otpCache.del(email); // Optionally, delete the OTP after successful verification
            req.session.email = ''; // Clear the email from session
            req.session.user = null;

            generateToken(userData, res);

        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ error: "Failed to verify OTP" });
    } finally {
        await closeMySQL();
    }
};




export const logoutMySQL = (req: Request, res: Response) => {
    const token = req.cookies.jwtToken;

    // Check if the JWT token is present
    if (!token) {
        return res.status(400).json({ error: "No active session or already logged out" });
    }

    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ error: "Failed to log out" });
        }

        // Clear the JWT cookie
        res.clearCookie('jwtToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        return res.status(200).json({ message: "Logout successful" });
         
    });
};



export const TotalNames = async (req: Request, res: Response) => {
    try{
        const name = req.query.name as string;  
        const result = await FindNames();
        
        res.json(result);
    }catch(error){
        
        console.error("Error in fetching the names:", error);
        res.status(500).json({ error: "Failed to fetch the names" });
    } finally {
        await closeMySQL();
        await closePGconnection();
    }
};

