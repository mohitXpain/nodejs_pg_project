"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.verifyLogin = exports.login = exports.insertUser = exports.fetchUsers = void 0;
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const otpStore_1 = require("../utiles/otpStore");
const node_cache_1 = __importDefault(require("node-cache"));
const UserModel_1 = require("../model/UserModel");
const jwtServices_1 = require("../services/jwtServices");
dotenv_1.default.config({ path: './src/.env' });
const fetchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getuser = yield (0, UserModel_1.GetAllUser)();
        res.json(getuser);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
exports.fetchUsers = fetchUsers;
const generateOtp = () => crypto_1.default.randomInt(100000, 999999).toString();
const otpCache = new node_cache_1.default({ stdTTL: 300 });
const insertUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const user = yield (0, UserModel_1.FindUserByName)(name);
        const user_email = yield (0, UserModel_1.FindUserByEmail)(email);
        if (user.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (user_email.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }
        yield (0, UserModel_1.Register)(name, phone, email, password);
        res.status(200).json({ message: "User created successfully" });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to store users" });
    }
});
exports.insertUser = insertUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = yield (0, UserModel_1.FindUserByEmail)(email);
        if (user.length === 0) {
            console.log(`User not found for email: ${email}`);
            res.clearCookie('jwtToken', { httpOnly: true, secure: true, sameSite: 'strict' });
            return res.status(400).json({ message: 'User not found' });
        }
        const userData = user[0];
        if (password !== userData.password) {
            console.log(`Invalid password for email: ${email}`);
            res.clearCookie('jwtToken', { httpOnly: true, secure: true, sameSite: 'strict' });
            return res.status(400).json({ message: 'Incorrect Password.' });
        }
        if (!userData.otp_verified) {
            const otp = generateOtp();
            otpCache.set(email, otp);
            yield (0, otpStore_1.sendOtpEmail)(email, otp);
            req.session.email = email;
            req.session.user = userData;
            return res.status(200).json({ message: "OTP sent to your email" });
        }
        (0, jwtServices_1.generateToken)(userData, res);
    }
    catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Failed to login user" });
    }
});
exports.login = login;
const verifyLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const email = req.session.email;
    const userData = req.session.user;
    if (!email) {
        return res.status(400).json({ message: 'No email found in session' });
    }
    try {
        const cachedOtp = otpCache.get(email);
        if (!cachedOtp) {
            return res.status(400).json({ message: 'OTP has expired or is invalid' });
        }
        if (cachedOtp === otp) {
            yield (0, UserModel_1.UpdateOtpverify)(email);
            otpCache.del(email); // Optionally, delete the OTP after successful verification
            req.session.email = ''; // Clear the email from session
            req.session.user = null;
            (0, jwtServices_1.generateToken)(userData, res);
        }
        else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ error: "Failed to verify OTP" });
    }
});
exports.verifyLogin = verifyLogin;
const logout = (req, res) => {
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
exports.logout = logout;
