import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
// function to add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      deal,
    } = req.body;
    const img1 = req.files.img1 && req.files.img1[0];
    const img2 = req.files.img2 && req.files.img2[0];
    const images = [img1, img2].filter((item) => item !== undefined);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image',
        });
        return result.secure_url;
      })
    );
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === 'true' ? true : false,
      deal: deal === 'true' ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    console.log(productData);
    const product = new productModel(productData);
    await product.save();
    res.json({ success: true, message: 'Product Added' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function to list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function to remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// --- ⭐ Add Review ---
const addReview = async (req, res) => {
  try {
    console.log(req.user);
    const { id } = req.params; // product id comes as :id in route
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: 'Rating & comment are required' });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    // ✅ user is taken from authUser middleware
    const review = {
      user: req.user._id,
      name: req.user.name, // store name directly for frontend
      rating: Number(rating),
      comment,
      replies: [],
    };

    product.reviews.push(review);

    // calculate avg rating
    product.averageRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();

    res.json({ success: true, message: 'Review added', product });
  } catch (error) {
    console.error('❌ Add Review Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 💬 Admin Reply to Review ---
const replyReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const { message, adminId } = req.body;

    const product = await productModel.findById(id);
    if (!product)
      return res.json({ success: false, message: 'Product not found' });

    const review = product.reviews.id(reviewId);
    if (!review)
      return res.json({ success: false, message: 'Review not found' });

    review.replies.push({ admin: adminId, message });
    await product.save();

    res.json({ success: true, message: 'Reply added', product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// --- ⭐ Get all reviews for a product ---
const getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel
      .findById(id)
      .populate('reviews.user', 'name email'); // so we can also show user info if needed

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// --- ❌ Delete Review (only by the review owner) ---
const deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params; // product id & review id
    const userId = req.user._id; // from authUser middleware

    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: 'Review not found' });
    }

    // ✅ check if the logged-in user is the one who wrote this review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    // remove review
    review.deleteOne();

    // update average rating
    if (product.reviews.length > 0) {
      product.averageRating =
        product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length;
    } else {
      product.averageRating = 0;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Review deleted',
      reviews: product.reviews,
    });
  } catch (error) {
    console.error('❌ Delete Review Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addProduct,
  listProducts,
  singleProduct,
  removeProduct,
  addReview,
  replyReview,
  getReviews,
  deleteReview,
};
