import mongoose from 'mongoose';

// --- Review Schema ---
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  replies: [
    {
      admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin replying
      message: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: false },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean, required: true },
  deal: { type: Boolean, required: true },
  date: { type: Date, default: Date.now },

  // --- New fields for reviews ---
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
});

// Method to recalc average rating
productSchema.methods.calculateAvgRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }
  return this.averageRating;
};

const productModel =
  mongoose.models.product || mongoose.model('Product', productSchema);

export default productModel;
