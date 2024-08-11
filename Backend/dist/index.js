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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./config/db");
const UserRouter_1 = __importDefault(require("./router/UserRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './src/.env' });
const app = (0, express_1.default)();
if (!process.env.PORT) {
    throw new Error("PORT environment variable is not defined");
}
const port = parseInt(process.env.PORT, 10);
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: 'A!lF0rOnE_oNef0RaL!',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use('/auth', UserRouter_1.default);
app.get('/', (req, res) => {
    res.send("Food app");
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.client.query("SELECT 1");
        console.log("PostgreSQL database connected successfully");
        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Failed to connect to the database:", error);
    }
}))();
