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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOtpverify = exports.FindUserByEmail = exports.FindUserByName = exports.Register = exports.GetAllUser = void 0;
const db_1 = require("../config/db");
const GetAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.client.query('SELECT * FROM users');
        const user = result.rows;
        return user;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error("Database query failed: " + error.message);
        }
        else {
            throw new Error("Database query failed with an unknown error");
        }
    }
});
exports.GetAllUser = GetAllUser;
const Register = (name, phone, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.client.query('INSERT INTO users (name, phone, email, password, otp_verified) VALUES (?,?,?,?,?)', [name, phone, email, password, false]);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error("Insertion in Database failed: " + error.message);
        }
        else {
            throw new Error("Insertion in Database failed with an unknown error");
        }
    }
});
exports.Register = Register;
const FindUserByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.client.query('SELECT * FROM users WHERE name = ?', [name]);
        const userRow = result.rows[0];
        return userRow;
    }
    catch (error) {
        console.error('Error finding user:', error);
        throw new Error('Database error');
    }
});
exports.FindUserByName = FindUserByName;
// export const FindUserByPhone = async (phone: User['phone']) => {
//     try {
//         const [userRow] = await client.query('SELECT * FROM users WHERE phone = ?', [phone]);
//         return userRow as User[];
//     }catch(error){
//         console.error('Error finding user:', error);
//         throw new Error('Database error');
//     }
// };
const FindUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.client.query('SELECT * FROM users WHERE email = ?', [email]);
        const userRow = result.rows[0];
        return userRow;
    }
    catch (error) {
        console.error('Error finding email:', error);
        throw new Error('Database error');
    }
});
exports.FindUserByEmail = FindUserByEmail;
const UpdateOtpverify = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = yield db_1.client.query('UPDATE users SET otp_verified = true WHERE email = ?', [email]);
        const result = query.rows[0];
        return result;
    }
    catch (error) {
        console.error('Error updating otp:', error);
        throw new Error('Database error');
    }
});
exports.UpdateOtpverify = UpdateOtpverify;
