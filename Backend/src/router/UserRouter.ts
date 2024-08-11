import express from "express";
import { fetchUsers, insertUser, login, verifyLogin, logout, fetchUsersMySQL, insertUserMySQL, loginMySQL, verifyLoginMySQL, logoutMySQL,TotalNames } from "../controller/AuthController";
import { FindNames } from "../model/UserModel";


const router = express.Router();

router.get('/', fetchUsers);

router.post('/register/customer', insertUser);

router.get('/login', login);

router.get('/account-verify', verifyLogin);

router.get('/fetchSQL', fetchUsersMySQL);

router.post('/registerSQL/customer', insertUserMySQL);

router.get('/loginSQL', loginMySQL);

router.get('/account-verifySQL', verifyLoginMySQL);

router.get('/logoutSQL', loginMySQL);

router.get('/logout', logout);

router.get('/find_names', TotalNames);

export default router;


