import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


dotenv.config({path: './src/.env'});

let mysqlConnect: mysql.Connection | null = null;


    const getMySQLconnection = async () => {
        if(!mysqlConnect){
            mysqlConnect  = await mysql.createConnection({
                host: process.env.DB_HOST1,
                user: process.env.DB_USER1,
                password: process.env.DB_PASSWORD1,
                database: process.env.DB_NAME1
            });
            console.log('MySQL Database connected');
        }
        return mysqlConnect;
    };

const closeMySQL = async () => {
    if(mysqlConnect) {
        await mysqlConnect.end();
        mysqlConnect = null;
        console.log('MySQL Database Disconnected !!');
    }
};

export {getMySQLconnection, closeMySQL};