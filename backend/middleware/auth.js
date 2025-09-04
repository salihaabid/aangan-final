import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js'; // import your User model

const authUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not Authorized, Please Login Again',
    });
  }

  try {
    // decode token
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

    // fetch user from DB
    const user = await userModel.findById(decoded_token.id).select('-password');
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // attach full user object to req
    req.user = user;

    next();
  } catch (error) {
    console.error('❌ Auth Middleware Error:', error);
    res.status(401).json({ success: false, message: 'Invalid Token' });
  }
};

export default authUser;
