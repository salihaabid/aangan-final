import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
// PLACE ORDER THROUGH COD

const placeOrder = async (req, res) => {
  try {
    const { userId, products, payment, shippingDetails } = req.body;
    if (!userId) {
      return res.json({ success: false, message: 'User ID required' });
    }

    const orderData = {
      userId,
      products,
      payment,
      shippingDetails,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // RESET CART DATA
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: 'Order Placed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// USER ORDER DATA
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.json({ success: false, message: 'User ID required' });
    }
    const orders = await orderModel.find({ userId });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// DISPLAY ORDERS ON ADMIN PANEL
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// UPDATE ORDER STATUS(ONLY ADMIN)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: 'Status Updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { placeOrder, allOrders, userOrders, updateOrderStatus };
