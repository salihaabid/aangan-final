import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowData = location.state?.product || null;
  const {
    cartItems,
    products,
    deliveryCharges,
    backendUrl,
    token,
    setCartItems,
  } = useContext(ShopContext);

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState('');
  // const [errors, setErrors] = useState({});
  const [cartData, setCartData] = useState([]);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  useEffect(() => {
    if (buyNowData) {
      // If Buy Now triggered
      setCartData([buyNowData]);
    } else {
      // Normal cart flow
      const itemsArray = [];
      for (const pid in cartItems) {
        for (const size in cartItems[pid]) {
          const product = products.find((p) => p._id === pid);
          if (product) {
            itemsArray.push({
              id: pid,
              name: product.name,
              price: product.price,
              qty: cartItems[pid][size],
              img: product.image[0],
              size,
            });
          }
        }
      }
      setCartData(itemsArray);
    }
  }, [cartItems, products, buyNowData]);

  const subtotal = cartData.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handleApplyCoupon = () => {
    if (coupon.toLowerCase() === 'coupon10') {
      setDiscount(subtotal * 0.1);
      setMessage('🎉 Coupon applied! You saved 10%.');
    } else {
      setDiscount(0);
      setMessage('❌ Invalid coupon code.');
    }
  };

  const totalAfterDiscount = subtotal - discount;
  const shipping = totalAfterDiscount > 3000 ? 0 : deliveryCharges;
  const total = totalAfterDiscount + shipping;

  // const onSubmitHandler = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let orderItems = [];
  //     for (const items in cartItems) {
  //       for (const item in cartItems[items]) {
  //         if (cartItems[items][item] > 0) {
  //           const itemInfo = structuredClone(
  //             products.find((product) => product._id === items)
  //           );
  //           if (itemInfo) {
  //             itemInfo.size = item;
  //             itemInfo.quantity = cartItems[items][item];
  //             orderItems.push(itemInfo);
  //           }
  //         }
  //       }
  //     }
  //     let orderData = {
  //       shippingDetails: formData,
  //       products: orderItems,
  //       payment: total,
  //     };
  //     const response = await axios.post(
  //       backendUrl + '/api/order/placeOrder',
  //       orderData,
  //       { headers: { token } }
  //     );
  //     console.log(response.data.success);

  //     if (response.data.success) {
  //       setCartItems({});
  //       navigate('/orders');
  //     } else {
  //       toast.error(response.data.message);
  //       console.log(response.data.message);
  //     }
  //     // console.log(orderItems);
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];

      if (buyNowData) {
        // Normalize Buy Now product shape
        orderItems.push({
          _id: buyNowData.id,
          name: buyNowData.name,
          price: buyNowData.price,
          quantity: buyNowData.qty,
          size: buyNowData.size,
          image: [buyNowData.img], // match what Orders.jsx expects
        });
      } else {
        // Normal cart checkout
        for (const items in cartItems) {
          for (const item in cartItems[items]) {
            if (cartItems[items][item] > 0) {
              const itemInfo = structuredClone(
                products.find((product) => product._id === items)
              );
              if (itemInfo) {
                itemInfo.size = item;
                itemInfo.quantity = cartItems[items][item];
                orderItems.push(itemInfo);
              }
            }
          }
        }
      }

      let orderData = {
        shippingDetails: formData,
        products: orderItems,
        payment: total,
      };

      const response = await axios.post(
        backendUrl + '/api/order/placeOrder',
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems({});
        navigate('/orders');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-screen flex justify-center'>
      <div className='w-full max-w-7xl grid grid-cols-1 md:grid-cols-[60%_40%]'>
        {/* Left: Contact & Delivery */}
        <form
          className='p-8 border-r-2 border-[#77846a]/80'
          onSubmit={onSubmitHandler}
        >
          <h2 className='text-2xl font-semibold mb-6 text-[#2a4125]'>
            Contact
          </h2>
          <input
            type='email'
            placeholder='Email *'
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className='w-full border rounded-lg px-4 py-2 mb-1 focus:ring-0 focus:outline-none'
            required
          />

          <div className='flex items-center mb-6'>
            <input
              type='checkbox'
              defaultChecked
              className='mr-2 text-[#2a4125] accent-[#2a4125] focus:ring-0 focus:outline-none'
              required
            />
            <span>Email me with news and offers</span>
          </div>

          <h2 className='text-2xl font-semibold mb-6 text-[#2a4125]'>
            Delivery
          </h2>
          <select className='w-full border rounded-lg px-4 py-2 mb-3'>
            <option>Pakistan</option>
          </select>
          <div className='sm:grid sm:grid-cols-2 sm:gap-3'>
            {/* First name */}
            <div className='w-full mb-3'>
              <label htmlFor='firstName' className='sr-only'>
                First name *
              </label>
              <div className='border rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#77846a]'>
                <input
                  id='firstName'
                  name='firstName'
                  type='text'
                  autoComplete='given-name'
                  placeholder='First name *'
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className='w-full bg-transparent border-none outline-none focus:ring-0'
                  required
                />
              </div>
            </div>

            {/* Last name */}
            <div className='w-full mb-3'>
              <label htmlFor='lastName' className='sr-only'>
                Last name *
              </label>
              <div className='border rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#77846a]'>
                <input
                  id='lastName'
                  name='lastName'
                  type='text'
                  autoComplete='family-name'
                  placeholder='Last name *'
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className='w-full bg-transparent border-none outline-none focus:ring-0'
                  required
                />
              </div>
            </div>
          </div>

          <div className='mt-3'>
            <input
              type='text'
              placeholder='Address *'
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className='w-full border rounded-lg px-4 py-2 focus:ring-0 focus:outline-none'
              required
            />
          </div>

          <input
            type='text'
            placeholder='Apartment, suite, etc. (optional)'
            value={formData.apartment}
            onChange={(e) =>
              setFormData({ ...formData, apartment: e.target.value })
            }
            className='w-full border rounded-lg px-4 py-2 mt-3 focus:ring-0 focus:outline-none'
          />
          <div className='sm:grid sm:grid-cols-2 sm:gap-3 mt-3'>
            {/* City */}
            <div className='w-full mb-3'>
              <label htmlFor='city' className='sr-only'>
                City *
              </label>
              <div className='border rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#77846a]'>
                <input
                  id='city'
                  name='city'
                  type='text'
                  placeholder='City *'
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className='w-full bg-transparent border-none outline-none focus:ring-0'
                  required
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className='w-full mb-3'>
              <label htmlFor='postalCode' className='sr-only'>
                Postal code
              </label>
              <div className='border rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#77846a]'>
                <input
                  id='postalCode'
                  name='postalCode'
                  type='text'
                  placeholder='Postal code (optional)'
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  className='w-full bg-transparent border-none outline-none focus:ring-0'
                />
              </div>
            </div>
          </div>

          <div className='mt-3'>
            <input
              type='text'
              placeholder='Phone *'
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className='w-full border rounded-lg px-4 py-2 focus:ring-0 focus:outline-none'
              required
            />
          </div>

          <h2 className='text-2xl font-semibold mt-8 mb-4 text-[#2a4125]'>
            Delivery Charges
          </h2>
          <div className='border rounded-lg px-4 py-3 flex justify-between items-center'>
            <span>
              {totalAfterDiscount > 2000 ? 'Order Above 3000' : 'Standard'}
            </span>
            <span className='font-semibold'>
              {shipping === 0 ? 'FREE' : `Rs ${shipping}`}
            </span>
          </div>

          <h2 className='text-2xl font-semibold mt-8 mb-4 text-[#2a4125]'>
            Payment
          </h2>
          <div className='border rounded-lg px-4 py-3 flex justify-between items-center'>
            <span>Cash on Delivery (COD)</span>
            <span className='font-semibold'>✔</span>
          </div>

          <button
            type='submit'
            className='mt-6 w-full bg-[#2a4125] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer no-underline inline-block text-center'
          >
            Complete Order
          </button>
        </form>

        {/* Right: Order Summary */}
        <div className='p-8 sticky top-0 self-start'>
          <h2 className='text-2xl font-semibold mb-6 text-[#2a4125]'>
            Order Summary
          </h2>
          <div className='space-y-4 text-[#2a4125]'>
            {cartData.map((item) => (
              <div
                key={item.id + item.size}
                className='flex justify-between items-center'
              >
                <div className='flex items-center space-x-3'>
                  <img
                    src={item.img}
                    alt={item.name}
                    className='w-14 h-14 rounded'
                  />
                  <div>
                    <p className='font-medium'>{item.name}</p>
                    <p className='text-sm text-[#77846a]'>Qty: {item.qty}</p>
                    {item.size && (
                      <p className='text-xs text-gray-500'>Size: {item.size}</p>
                    )}
                  </div>
                </div>
                <p className='font-semibold'>Rs {item.price * item.qty}</p>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className='flex mt-6'>
            <input
              type='text'
              placeholder='Enter Promo Code'
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className='flex-1 border border-[#77846a] rounded-l-xl px-4 py-2
               focus:outline-none
               text-[#2a4125] placeholder-[#77846a] focus:ring-0 focus:outline-none'
            />
            <button
              onClick={handleApplyCoupon}
              className='bg-[#2a4125] text-white px-6 rounded-r-xl
               hover:bg-[#1e301b] transition-colors duration-200 cursor-pointer
               '
            >
              Apply
            </button>
          </div>

          {message && <p className='text-sm mt-2 text-green-600'>{message}</p>}

          {/* Price Details */}
          <div className='mt-6 space-y-2'>
            <div className='flex justify-between text-[#2a4125]'>
              <p>Subtotal ({cartData.length} items)</p>
              <p>Rs {subtotal.toFixed(2)}</p>
            </div>
            {discount > 0 && (
              <div className='flex justify-between text-green-600'>
                <p>Discount</p>
                <p>- Rs {discount.toFixed(2)}</p>
              </div>
            )}
            <div className='flex justify-between text-[#2a4125]'>
              <p>Shipping</p>
              <p>{shipping === 0 ? 'FREE' : `Rs ${shipping}`}</p>
            </div>
            <hr />
            <div className='flex justify-between font-bold text-lg text-[#2a4125]'>
              <p>Total</p>
              <p>PKR {total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
