export interface User {
    id: number;
    name: string;
    phone: number;
    email: string;
    password: string;
    otp_verified: string;
}


export interface Owner {
    id: number;
    name: string;
    phone: number;
    email: string;
    password: string;
    otp_verified: string;
}


export interface Data {
    data?: User[];
    source: string;
    mysqlNames: string;
    pgNames: string;
    total_count: number;
}

export interface UserData {
    id: number;
    name: string;
    email: string;
}


export interface DB {
    host?: string;
    user?: string;
    password?: string;
    database?: string;
    port? : number;
}


declare module 'express-session' {
    interface SessionData {
        email?: string;
        phone?: string;
        user?: UserData | null;
    }
}