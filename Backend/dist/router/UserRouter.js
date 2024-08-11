"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controller/AuthController");
const router = express_1.default.Router();
router.get('/', AuthController_1.fetchUsers);
router.post('/register/customer', AuthController_1.insertUser);
router.get('/login', AuthController_1.login);
router.get('/account-verify', AuthController_1.verifyLogin);
router.get('/logout', AuthController_1.logout);
exports.default = router;
