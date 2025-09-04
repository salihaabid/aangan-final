import express from 'express';
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  addReview,
  replyReview,
  getReviews,
  deleteReview,
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const productRouter = express.Router();

productRouter.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
  ]),
  addProduct
);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);

// ⭐ New review endpoints
productRouter.post('/:id/review', authUser, addReview); // User adds review
productRouter.post('/:id/review/:reviewId/reply', adminAuth, replyReview); // Admin reply
productRouter.get('/:id/reviews', getReviews);
productRouter.delete('/:id/review/:reviewId', authUser, deleteReview);

export default productRouter;
