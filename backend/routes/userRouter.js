import express from 'express';
import {
  loginUser,
  registerUser,
  adminLogin,
} from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/me', authUser, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default userRouter;
