import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import {
  FaMinus,
  FaPlus,
  FaLeaf,
  FaCheckSquare,
  FaHeart,
  FaStar,
  FaPaperPlane,
} from 'react-icons/fa';
import RelatedProducts from '../ui/RelatedProducts';
import { toast } from 'react-toastify';
import axios from 'axios';
import { io } from 'socket.io-client';
import ReviewsSection from '../ui/ReviewSection';

export default function Product() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { products, addToCart, backendUrl, token, user } =
    useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Socket.io
  const socket = io('http://localhost:5000', {
    transports: ['websocket'],
  });

  // Fetch product + reviews
  useEffect(() => {
    fetchProductData();

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/product/${productId}/reviews`
        );
        if (res.data.success) {
          setReviews(res.data.reviews);
        }
      } catch (error) {
        console.error('Error fetching reviews', error);
      }
    };

    fetchReviews();
    setQuantity(1);
  }, [productId, products]);

  // Socket listeners for live updates
  useEffect(() => {
    socket.on('reviewAdded', (newReview) => {
      setReviews((prev) => [...prev, newReview]);
    });

    socket.on('replyAdded', (reply) => {
      console.log('Admin reply received:', reply);
      // optional: attach reply to specific review later
    });

    return () => {
      socket.off('reviewAdded');
      socket.off('replyAdded');
    };
  }, [socket]);

  const handleDeleteSubmit = async (rev) => {
    try {
      const res = await axios.delete(
        `${backendUrl}/api/product/${productId}/review/${rev._id}`,
        {
          headers: { token },
        }
      );
      if (res.data.success) {
        setReviews(res.data.reviews);
        toast.success('Review deleted');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Delete review error', error);
      toast.error('Error deleting review');
    }
  };
  const handleReviewSubmit = async () => {
    if (!token) {
      toast.error('Login/Signup first to add review');
      setReviewError('⚠️ Please login or signup first to add a review');
      return;
    }

    if (!rating || !comment.trim()) {
      toast.error('Please add rating and comment');
      setReviewError('⚠️ Rating and comment are required');
      return;
    }

    try {
      const reviewData = { rating, comment };

      const res = await axios.post(
        `${backendUrl}/api/product/${productId}/review`,
        reviewData,
        {
          headers: { token },
        }
      );
      console.log(res);
      if (res.data.success && res.data.product?.reviews) {
        setReviews(res.data.product.reviews);
        socket.emit('newReview', res.data.product.reviews);

        setRating(0);
        setComment('');
        setReviewError('');
        toast.success('Review submitted!');
      } else {
        toast.error(res.data.message || 'Failed to add review');
      }
    } catch (err) {
      toast.error('Error submitting review');
      console.error(err);
    }
  };

  const fetchProductData = () => {
    products.forEach((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        setSelectedSize(item.sizes[0]);
      }
    });
  };

  useEffect(() => {
    fetchProductData();
    setQuantity(1);
  }, [productId, products]);

  if (!productData) {
    return <div className='opacity-0'>Loading...</div>;
  }

  return (
    <>
      <div className='max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* Left Side - Images */}
        <div>
          <img
            src={image}
            alt={productData.name}
            className='rounded-xl shadow-lg w-full'
          />
          <div className='flex gap-3 mt-4'>
            {productData.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={productData.name}
                onClick={() => setImage(img)}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer border ${
                  img === image ? 'border-[#2a4125]' : 'border-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Details */}
        <div>
          {/* Title */}
          <h1 className='text-3xl font-semibold text-[#2a4125]'>
            {productData.name}
          </h1>

          {/* Price */}
          <p className='text-2xl font-bold text-[#2a4125] mt-2'>
            Rs.{productData.price}.00 PKR
          </p>

          {/* Rating */}
          <div className='flex items-center gap-2 mt-2 text-yellow-500'>
            <FaStar size={18} fill='currentColor' />
            <span className='text-gray-700 font-medium'>
              {productData.averageRating} / 5
            </span>
          </div>

          {/* Quantity Selector */}
          <div className='flex items-center mt-5 gap-3'>
            <button
              className='p-2 border rounded-md cursor-pointer'
              onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            >
              <FaMinus size={16} />
            </button>
            <span>{quantity}</span>
            <button
              className='p-2 border rounded-md cursor-pointer'
              onClick={() => setQuantity(quantity + 1)}
            >
              <FaPlus size={16} />
            </button>
            <span className='ml-3 text-[#2a4125] font-medium'>✅ In Stock</span>
          </div>

          {/* Sizes */}
          <div className='mt-5'>
            <h3 className='font-medium text-gray-800 mb-2'>Available Sizes:</h3>
            <div className='flex gap-3'>
              {productData.sizes.map((size, index) => (
                <span
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-2 rounded-full cursor-pointer border 
        ${
          selectedSize === size
            ? 'bg-[#2a4125] text-[#fef7e5] border-[#2a4125]'
            : 'border-[#2a4125] text-[#2a4125]'
        }`}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className='flex gap-8 mt-6 text-[#2a4125]'>
            <div className='flex items-center gap-2'>
              <FaLeaf size={18} /> Natural Product
            </div>
            <div className='flex items-center gap-2'>
              <FaCheckSquare size={18} /> Daily Fresh
            </div>
            <div className='flex items-center gap-2'>
              <FaHeart size={18} /> Best Quality
            </div>
          </div>

          {/* Buttons */}
          <div className='mt-6 flex gap-4'>
            <button
              className='flex-1 border border-[#2a4125] py-3 rounded-full text-[#2a4125] cursor-pointer'
              onClick={() => {
                addToCart(productData._id, quantity, selectedSize);
                toast.success(`${productData.name} added to cart!`);
              }}
            >
              Add to cart
            </button>
            <button
              className='flex-1 bg-[#2a4125] text-white py-3 rounded-full cursor-pointer'
              onClick={() => {
                navigate('/checkout', {
                  state: {
                    buyNow: true,
                    product: {
                      id: productData._id,
                      name: productData.name,
                      price: productData.price,
                      qty: quantity,
                      img: productData.image[0],
                      size: selectedSize,
                    },
                  },
                });
              }}
            >
              Buy it now
            </button>
          </div>

          {/* Description */}
          <p className='mt-6 text-gray-700 leading-relaxed'>
            {productData.description}
          </p>

          {/* Collapsible Sections */}
          <div className='mt-6 border-t pt-4'>
            <details>
              <summary className='cursor-pointer font-medium'>About Us</summary>
              <p className='mt-2 text-gray-600'>
                We provide the freshest cheese products with premium quality
                directly from Aangan Dairy.
              </p>
            </details>

            <details className='mt-4'>
              <summary className='cursor-pointer font-medium'>
                Shipping Policy
              </summary>
              <p className='mt-2 text-gray-600'>
                Shipping calculated at checkout. Usually delivered in 2–3
                working days.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* ⭐ Review Section */}
      <ReviewsSection
        reviews={reviews}
        user={user}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        reviewError={reviewError}
        handleReviewSubmit={handleReviewSubmit}
        handleDeleteSubmit={handleDeleteSubmit}
      />

      {/* Related Products */}
      <RelatedProducts category={productData.category} />
    </>
  );
}
