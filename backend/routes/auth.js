// routes/auth.js

const { Router } = require('express');
const authController = require('../controllers/auth');
const authRouter = Router();

authRouter.post("/signup", authController.postUser);
authRouter.post("/login", authController.postLogin);
authRouter.get('/user', authController.getUserFromToken);
authRouter.put('/user', authController.updateUserInfo);

module.exports = authRouter;