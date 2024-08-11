import { getPGconnection } from "../config/postgres";
import { getMySQLconnection } from "../config/mysql";
import { User } from "../annotation/userAnnotation";
import { RowDataPacket } from 'mysql2';



export const GetAllUser = async () => {
    try {
        const client = await getPGconnection();
        const result = await client.query('SELECT * FROM users');
        const user = result.rows;
        return user; 
    }catch(error){
        if (error instanceof Error) {
            throw new Error("Database query failed: " + error.message);
        } else {
            throw new Error("Database query failed with an unknown error");
        }
    }
}


export const Register = async (name: User['name'], phone: User['phone'], email: User['email'], password: User['password']) => {
    try {
        const client = await getPGconnection();
        await client.query('INSERT INTO users (name, phone, email, password, otp_verified) VALUES ($1,$2,$3,$4,$5)', [name, phone, email, password, 0]);
    }catch(error){
        if (error instanceof Error) {
            throw new Error("Insertion in Database failed: " + error.message);
        } else {
            throw new Error("Insertion in Database failed with an unknown error");
        }
    }
};

export const FindUserByName = async (name: User['name']) => {
    try {
        const client = await getPGconnection();
        const result = await client.query('SELECT * FROM users WHERE name = $1', [name]);
        const userRow = result.rows[0] as User;
        return userRow;
    }catch(error){
        console.error('Error finding user:', error);
        throw new Error('Database error');
    }
}

// export const FindUserByPhone = async (phone: User['phone']) => {
//     try {
//         const [userRow] = await client.query('SELECT * FROM users WHERE phone = ?', [phone]);
//         return userRow as User[];
//     }catch(error){
//         console.error('Error finding user:', error);
//         throw new Error('Database error');
//     }
// };


export const FindUserByEmail = async (email: User['email']) => {
    try {
        const client = await getPGconnection();
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const userRow = result.rows[0] as User;
        return userRow;
    }catch(error){
        console.error('Error finding email:', error);
        throw new Error('Database error');
    }
};

export const UpdateOtpverify = async (email: User['email']) => {
    try {
        const client = await getPGconnection();
        const query = await client.query('UPDATE users SET otp_verified = 1 WHERE email = $1', [email]);
        const result = query.rows[0];
        return result;
    }catch(error){
        console.error('Error updating otp:', error);
        throw new Error('Database error');
    }
};






export const GetAllUserbyMySQL = async () => {
    try {
        const db = await getMySQLconnection();
        const [user] = await db.query('SELECT * FROM users');
        return user as User[];
    }catch(error){
        if (error instanceof Error) {
            throw new Error("Database query failed: " + error.message);
        } else {
            throw new Error("Database query failed with an unknown error");
        }
    }
}


export const RegisterMySQL = async (name: User['name'], phone: User['phone'], email: User['email'], password: User['password']) => {
    try {       
        const db = await getMySQLconnection();
        await db.query('INSERT INTO users (name, phone, email, password, otp_verified) VALUES (?,?,?,?,?)', [name, phone, email, password, false]);
    }catch(error){
        if (error instanceof Error) {
            throw new Error("Insertion in Database failed: " + error.message);
        } else {
            throw new Error("Insertion in Database failed with an unknown error");
        }
    }
};

export const FindUserByNameMySQL = async (name: User['name']) => {
    try {
        const db = await getMySQLconnection();
        const [userRow] = await db.query('SELECT * FROM users WHERE name = ?', [name]);
        return userRow as User[];
    }catch(error){
        console.error('Error finding user:', error);
        throw new Error('Database error');
    }
}

// export const FindUserByPhone = async (phone: User['phone']) => {
//     try {
//         const [userRow] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
//         return userRow as User[];
//     }catch(error){
//         console.error('Error finding user:', error);
//         throw new Error('Database error');
//     }
// };


export const FindUserByEmailMySQL = async (email: User['email']) => {
    try {
        const db = await getMySQLconnection();
        const [userRow] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return userRow as User[];
    }catch(error){
        console.error('Error finding email:', error);
        throw new Error('Database error');
    }
};

export const UpdateOtpverifyMySQL = async (email: User['email']) => {
    try {
        const db = await getMySQLconnection();
        const [query] = await db.query('UPDATE users SET otp_verified = true WHERE email = ?', [email]);
        return query;
    }catch(error){
        console.error('Error updating otp:', error);
        throw new Error('Database error');
    }
};



export const FindNames = async () => {
    try{
        const db = await getMySQLconnection();
        const client = await getPGconnection();

        const [query] = await db.query<RowDataPacket[]>('SELECT name FROM users');
        const mysqlNames = query.map((row) => row.name) as User[];
        const mysqlCount = mysqlNames.length;

        const result =  await client.query('SELECT name FROM users');
        const pgNames = result.rows.map((row) => row.name) as User[];
        const pgcount = pgNames.length;

        const names = [...mysqlNames, ...pgNames];
        const total_count = mysqlCount + pgcount;

        return { mysqlNames, pgNames, names, total_count };

        
    }catch(error){
        console.error('Error in finding names from databases: ', error);
        throw new Error('Database Error');
    }
}