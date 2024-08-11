import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { UserData } from "../annotation/userAnnotation";



export function generateToken(userData: UserData, res: Response) {

    const payload  = {
        userId: userData.id,
        name: userData.name,
        email: userData.email
    };
    
    const jwtSecret = process.env.JWT_SECRET;
    
    if(!jwtSecret){
        console.error('JWT secret is not defined');
        return res.status(500).json({ error: 'JWT secret is not defined' });
    }
    
    const token = jwt.sign(payload, jwtSecret);
    
    res.cookie('jwtToken',token, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(200).json({ message: "Login successful", token: token });


}
