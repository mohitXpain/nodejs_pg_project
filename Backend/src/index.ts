 import express, {Application, Request, Response} from "express";
 import bodyParser from "body-parser";
 import session from "express-session"
 import cookieParser from "cookie-parser";
 import { closePGconnection } from "./config/postgres";
 import { closeMySQL } from "./config/mysql";
 import router from "./router/UserRouter";
 import {Server} from 'http';
 import dotenv from 'dotenv';
 

 dotenv.config({path: './src/.env'});
 

 const app: Application = express();


if (!process.env.PORT) {
  throw new Error("PORT environment variable is not defined");
}

const port: number = parseInt(process.env.PORT, 10);

app.use(bodyParser.json());
app.use(cookieParser());


app.use(session({
  secret: 'A!lF0rOnE_oNef0RaL!',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

 app.use('/auth', router);


app.get('/', (req: Request, res: Response) => {
    res.send("Food app");
});



(async () => {
      const server: Server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
  })();


const closeConnection = async () => {
  await closeMySQL();
  await closePGconnection();
};


process.on('SIGINT', () => {  
  closeConnection().then(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

