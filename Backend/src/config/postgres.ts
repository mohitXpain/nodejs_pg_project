import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({path: './src/.env'});

let dbConfig: Client | null = null;

const getPGconnection = async () => {
    if(!dbConfig){
        dbConfig = new Client({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT)
        });
        await dbConfig.connect();
        console.log('Postgres is Connected !!');
    }
    return dbConfig;
}; 

const closePGconnection = async () => {
    if(dbConfig){
        await dbConfig.end();
        dbConfig = null;
        console.log('Postgres Database Disconnected !!');
    }
};


export {getPGconnection, closePGconnection};

 