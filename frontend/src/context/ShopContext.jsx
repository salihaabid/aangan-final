import { createContext, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

// import { products } from '../assets/assets';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const deliveryCharges = 200;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');

  const addToCart = async (productId, quantity = 1, size) => {
    let cartData = structuredClone(cartItems);

    // If product already exists
    if (cartData[productId]) {
      if (cartData[productId][size]) {
        cartData[productId][size] += quantity; // increment existing size quantity
      } else {
        cartData[productId][size] = quantity; // new size for this product
      }
    } else {
      // New product in cart
      cartData[productId] = {};
      cartData[productId][size] = quantity;
    }

    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(
          backendUrl + '/api/cart/add',
          { productId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let count = 0;

    // cartItems = { productId: { size: quantity } }
    for (let productId in cartItems) {
      for (let size in cartItems[productId]) {
        count += cartItems[productId][size];
      }
    }

    return count;
  };
  const clearCart = () => {
    setCartItems({}); // or your initial empty structure
  };

  // const updateQuantity = async (productId, size, quantity) => {
  //   let cartData = structuredClone(cartItems);
  //   cartData[productId][size] = quantity;
  //   setCartItems(cartData);

  //   if (token) {
  //     try {
  //       await axios.post(
  //         backendUrl + '/api/cart/update',
  //         {
  //           productId,
  //           size,
  //           quantity,
  //         },
  //         { headers: { token } }
  //       );
  //     } catch (error) {
  //       console.error(error);
  //       toast.error(error.message);
  //     }
  //   }
  // };

  const updateQuantity = async (productId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity === 0) {
      // ❌ Remove item
      delete cartData[productId][size];
      if (Object.keys(cartData[productId]).length === 0) {
        delete cartData[productId];
      }
    } else {
      // ✅ Update qty
      cartData[productId][size] = quantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + '/api/cart/update',
          { productId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  // const getUserCart = async (token) => {
  //   try {
  //     const response = await axios.post(
  //       backendUrl + '/api/cart/get',
  //       {},
  //       { headers: { token } }
  //     );
  //     if (response.data.success) {
  //       setCartItems(response.data.cartData);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };

  const getUserCart = async (token) => {
    if (!token) {
      setCartItems({});
      return;
    }
    try {
      const response = await axios.post(
        backendUrl + '/api/cart/get',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);
  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
      getUserCart(localStorage.getItem('token'));
    }
  }, []);
  const value = {
    products,
    deliveryCharges,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    clearCart,
    backendUrl,
    token,
    setToken,
    getUserCart,
    setCartItems,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
