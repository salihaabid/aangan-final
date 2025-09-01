import mongoose from 'mongoose';
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
});

const productModel =
  mongoose.models.product || mongoose.model('Product', productSchema);

export default productModel;
