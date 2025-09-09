import { useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Orders() {
  const { backendUrl, token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const orderData = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendUrl + '/api/order/userOrders',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        let allOrdersProducts = [];
        response.data.orders.map((order) => {
          order.products.map((product) => {
            product['status'] = order.status;
            product['payment'] = order.payment;
            product['date'] = order.date;
            allOrdersProducts.push(product);
          });
        });
        setOrders(allOrdersProducts.reverse());
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  };

  // ✅ Load saved orders once
  useEffect(() => {
    orderData();
  }, [token]);

  // // ✅ Clear all orders
  // const clearOrders = () => {
  //   localStorage.removeItem('checkedOutOrders');
  //   setOrders([]);
  // };

  return (
    <div className='min-h-screen py-10 px-4'>
      {/* Title + Clear Button */}
      <div className='flex justify-between items-center max-w-5xl mx-auto mb-8'>
        <h1 className='text-4xl font-semibold text-[#2a4125]'>My Orders</h1>

        {/* {orders.length > 0 && (
          <button
            // onClick={clearOrders}
            className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition'
          >
            Clear Orders
          </button>
        )} */}
      </div>

      {/* Orders List */}
      {/* Orders List */}
      <div className='space-y-6 max-w-5xl mx-auto px-3'>
        {orders.length === 0 ? (
          <p className='text-center text-[#77846a] text-lg'>No orders yet 🛒</p>
        ) : (
          orders.map((order, i) => (
            <div
              key={i}
              className='border border-[#77846a]/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between'
            >
              {/* Product Info */}
              <div className='flex items-start gap-4 w-full sm:w-auto'>
                <img
                  src={order.image[0]}
                  alt={order.product}
                  className='w-20 h-20 object-cover rounded-lg border shadow-sm'
                />
                <div className='flex flex-col'>
                  <h2 className='text-lg font-semibold text-[#2a4125]'>
                    {order.name}
                  </h2>
                  <p className='text-[#2a4125]'>
                    <span className='text-[#77846a] font-medium'>
                      Subtotal:
                    </span>{' '}
                    <span className='font-semibold'>
                      Rs.{Math.round(order.payment)}.00 PKR
                    </span>
                  </p>
                  <p className='text-[#77846a] text-sm'>
                    Quantity: {order.quantity} | Size: {order.size}
                  </p>
                  <p className='text-[#77846a] text-sm'>
                    Date:{' '}
                    {new Date(order.date).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Status + Action */}
              <div className='flex flex-col items-center sm:items-end justify-center mt-4 sm:mt-0 gap-2 w-full sm:w-auto'>
                <span
                  className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full
    ${
      order.status === 'Delivered'
        ? 'text-green-700 bg-green-100'
        : order.status === 'Ready to Ship'
        ? 'text-blue-700 bg-blue-100'
        : order.status === 'Canceled'
        ? 'text-red-700 bg-red-100'
        : 'text-yellow-700 bg-yellow-100' // default → Order Placed
    }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full
      ${
        order.status === 'Delivered'
          ? 'bg-green-600'
          : order.status === 'Ready to Ship'
          ? 'bg-blue-600'
          : order.status === 'Canceled'
          ? 'bg-red-600'
          : 'bg-yellow-500'
      }`}
                  ></span>
                  {order.status}
                </span>

                <button
                  className='mt-2 px-4 py-1 border rounded-md text-[#77846a] cursor-pointer'
                  onClick={orderData}
                >
                  Track Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
