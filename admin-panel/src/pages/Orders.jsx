import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { backendUrl } from '../layout/Main';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Orders() {
  const { token } = useOutletContext();
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: e.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className='p-6 mt-2'>
      {/* Heading */}
      <div className='max-w-6xl mx-auto px-4'>
        <h2 className='text-4xl sm:text-5xl md:text-6xl text-[#2a4125] mb-8'>
          Orders
        </h2>

        {/* Orders */}
        <div className='space-y-6'>
          {orders
            .slice()
            .reverse()
            .map((order, i) => (
              <div
                key={i}
                className='grid grid-cols-1 md:grid-cols-[1fr_1.2fr_.5fr_auto] gap-6 border-[#77846a] border rounded-xl p-6'
              >
                {/* 1️⃣ Product Info */}
                <div>
                  {order.products.map((product, idx) => (
                    <div key={idx} className='flex items-start gap-3 mb-2'>
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className='w-16 h-16 object-cover rounded border'
                      />
                      <div>
                        <p className='font-medium text-[#2a4125]'>
                          {product.name} x {product.quantity}
                        </p>
                        <p className='text-sm text-[#77846a]'>
                          Size: {product.size}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2️⃣ Shipping Details */}
                <div>
                  <p className='font-semibold text-[#2a4125]'>
                    {order.shippingDetails.firstName}{' '}
                    {order.shippingDetails.lastName}
                  </p>
                  <p className='text-sm text-[#77846a]'>
                    {order.shippingDetails.address}
                  </p>
                  <p className='text-sm text-[#77846a]'>
                    {order.shippingDetails.city},{' '}
                    {order.shippingDetails.postalCode}
                  </p>
                  <p className='text-sm text-[#77846a]'>
                    {order.shippingDetails.phone}
                  </p>
                  <p className='text-sm text-[#77846a]'>
                    {order.shippingDetails.email}
                  </p>
                </div>

                {/* 3️⃣ Amount & Payment */}
                <div>
                  <p className='font-semibold text-[#2a4125]'>
                    Rs.{order.payment} PKR
                  </p>
                  <p className='text-sm text-[#77846a]'>
                    Items:{' '}
                    {order.products.reduce((total, p) => total + p.quantity, 0)}
                  </p>
                  <p className='text-sm text-[#77846a]'>Method: COD</p>
                  <p className='text-sm text-[#77846a]'>
                    Date:{' '}
                    {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {/* 4️⃣ Status Dropdown */}
                <div className='flex items-center'>
                  <select
                    value={order.status}
                    onChange={(e) => {
                      // 🔥 call API here to update status
                      console.log('New status:', e.target.value);
                      statusHandler(e, order._id);
                    }}
                    className='w-40 py-2 px-3 text-[#77846a] rounded cursor-pointer text-sm focus:outline-none focus:ring-0'
                    style={{
                      borderTop: '2px solid #2a4125',
                      borderLeft: '2px solid #2a4125',
                      borderRight: '2px solid #2a4125',
                      borderBottom: '4px solid #2a4125',
                    }}
                  >
                    <option value='Order Placed'>Order Placed</option>
                    <option value='Ready to Ship'>Ready to Ship</option>
                    <option value='Delivered'>Delivered</option>
                    <option value='Canceled'>Canceled</option>
                  </select>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
