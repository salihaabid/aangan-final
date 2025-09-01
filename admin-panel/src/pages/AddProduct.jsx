import { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../layout/Main';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddProduct() {
  const { token } = useOutletContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [deal, setDeal] = useState(false);
  const [category, setCategory] = useState('');
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log({ name, description, price, sizes, image1, image2 });

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('deal', deal);
      formData.append('category', category);
      formData.append('bestseller', bestseller);
      image1 && formData.append('img1', image1);
      image2 && formData.append('img2', image2);

      const response = await axios.post(
        backendUrl + '/api/product/add',
        formData,
        { headers: { token } }
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setName('');
        setDescription('');
        setPrice('');
        setSizes([]);
        setImage1(false);
        setImage2(false);
        setBestseller(false);
        setDeal(false);
        setCategory('');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className='p-6 mt-2'>
      {/* Heading */}
      <div className='max-w-5xl mx-auto sm:mx-20 px-4 text-left'>
        <h2 className='text-4xl sm:text-5xl md:text-6xl text-[#2a4125] leading-snug'>
          Add Product
        </h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='space-y-5 w-[80%] sm:w-[60%] ml-20 mt-10 text-[#2a4125] '
      >
        <div>
          <label className='block text-xl font-[500] mb-2'>Product Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full border border-[#77846a] rounded-lg p-2  outline-none'
            placeholder='Enter product name'
          />
        </div>

        <div>
          <label className='block text-xl font-[500] mb-2'>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full border border-[#77846a] rounded-lg p-2 h-24  outline-none'
            placeholder='Enter product description'
          ></textarea>
        </div>

        <div className='grid sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-xl font-[500] mb-2'>Price</label>
            <input
              type='number'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className='w-full border border-[#77846a] rounded-lg p-2  outline-none'
              placeholder='Enter price'
            />
          </div>

          <div>
            <label className='block text-xl font-[500] mb-2'>
              Sizes (comma separated)
            </label>
            <input
              type='text'
              value={sizes}
              onChange={(e) =>
                setSizes(e.target.value.split(',').map((s) => s.trim()))
              }
              className='w-full border border-[#77846a] rounded-lg p-2  outline-none'
              placeholder='1kg, 2kg, 3kg'
            />
          </div>
        </div>
        {/* ✅ New Checkboxes */}
        <div className='flex items-center gap-6'>
          <label className='flex items-center gap-2 text-xl font-[500] '>
            <input
              type='checkbox'
              id='bestseller'
              checked={bestseller}
              onChange={() => setBestseller((prev) => !prev)}
              className='w-4 h-4 accent-[#2a4125] '
            />
            Best Seller
          </label>

          <label className='flex items-center gap-2 text-xl font-[500] '>
            <input
              type='checkbox'
              checked={deal}
              id='deal'
              onChange={(e) => setDeal((prev) => !prev)}
              className='w-4 h-4 accent-[#2a4125]'
            />
            Deal
          </label>
        </div>

        {/* ✅ New Dropdown */}
        <div>
          <label className='block  mb-2 text-xl font-[500] '>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='w-full border border-[#77846a]  rounded-lg p-2 outline-none'
          >
            <option value=''>Select Category</option>
            <option value='Mozzarella'>Mozzarella</option>
            <option value='Cheddar'>Cheddar</option>
            <option value='Shredded'>Shredded</option>
            <option value='Deal'>Deal</option>
          </select>
        </div>

        <div className='grid sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-xl font-[500] mb-2'>Image 1</label>
            <input
              type='file'
              onChange={(e) => setImage1(e.target.files[0])}
              className='w-full border border-[#77846a] rounded-lg p-2 cursor-pointer'
            />
          </div>

          <div>
            <label className='block text-xl font-[500] mb-2'>Image 2</label>
            <input
              type='file'
              onChange={(e) => setImage2(e.target.files[0])}
              className='w-full border border-[#77846a] rounded-lg p-2 cursor-pointer'
            />
          </div>
        </div>

        <button
          type='submit'
          className='px-5 py-2 bg-[#2a4125] text-[#fef7e5] rounded-lg cursor-pointer transition'
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
