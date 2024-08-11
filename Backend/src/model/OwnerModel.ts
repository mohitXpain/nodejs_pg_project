import { getPGconnection } from "../config/postgres";
import { Owner } from "../annotation/userAnnotation";

export const OwnerRegister = async (name: Owner['name'], phone: Owner['phone'], email: Owner['email'], password: Owner['password']) => {
    try{
        const db = await getPGconnection();
        await db.query('INSERT INTO restaurant_owner (name, phone, email, password, otp_verified) VALUES ($1,$2,$3,$4,$5)', [name, phone, email, password, 0]);
    }catch(error){
        if (error instanceof Error) {
            throw new Error("Database query failed: " + error.message);
        } else {
            throw new Error("Database query failed with an unknown error");
        }
    }
}