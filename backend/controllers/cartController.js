import userModel from '../models/userModel.js';

// ✅ Add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, size } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    if (cartData[productId]) {
      if (cartData[productId][size]) {
        cartData[productId][size] += 1;
      } else {
        cartData[productId][size] = 1;
      }
    } else {
      cartData[productId] = {};
      cartData[productId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: 'Product Added To Cart' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Update user cart (increase, decrease, or remove)
const updateCart = async (req, res) => {
  try {
    const { userId, productId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (!cartData[productId]) {
      return res.json({ success: false, message: 'Product not found' });
    }

    if (quantity > 0) {
      cartData[productId][size] = quantity;
    } else {
      // delete item if quantity is 0
      delete cartData[productId][size];
      if (Object.keys(cartData[productId]).length === 0) {
        delete cartData[productId];
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: 'Cart Updated', cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body; // or req.query if passed in URL
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: 'User not found' });
    }
    let cartData = await userData.cartData;

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
