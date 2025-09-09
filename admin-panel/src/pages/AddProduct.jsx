import { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../layout/Main';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

export default function AddProduct() {
  const { token } = useOutletContext();

  // Local states only for checkboxes and files
  const [bestseller, setBestseller] = useState(false);
  const [deal, setDeal] = useState(false);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // Define mutation with TanStack
  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(
        backendUrl + '/api/product/add',
        formData,
        { headers: { token } }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        reset(); // reset hook-form inputs
        setBestseller(false);
        setDeal(false);
        setImage1(null);
        setImage2(null);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    },
  });

  const onSubmit = (data) => {
    // convert sizes into array
    const sizes = data.sizes ? data.sizes.split(',').map((s) => s.trim()) : [];

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('sizes', JSON.stringify(sizes));
    formData.append('deal', deal);
    formData.append('category', data.category);
    formData.append('bestseller', bestseller);
    image1 && formData.append('img1', image1);
    image2 && formData.append('img2', image2);

    //  trigger mutation
    mutate(formData);
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
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-5 w-[80%] sm:w-[60%] ml-20 mt-10 text-[#2a4125]'
      >
        <div>
          <label className='block text-xl font-[500] mb-2'>Product Name</label>
          <input
            type='text'
            {...register('name', { required: true })}
            className='w-full border border-[#77846a] rounded-lg p-2 outline-none'
            placeholder='Enter product name'
          />
        </div>

        <div>
          <label className='block text-xl font-[500] mb-2'>Description</label>
          <textarea
            {...register('description', { required: true })}
            className='w-full border border-[#77846a] rounded-lg p-2 h-24 outline-none'
            placeholder='Enter product description'
          ></textarea>
        </div>

        <div className='grid sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-xl font-[500] mb-2'>Price</label>
            <input
              type='number'
              {...register('price', { required: true })}
              className='w-full border border-[#77846a] rounded-lg p-2 outline-none'
              placeholder='Enter price'
            />
          </div>

          <div>
            <label className='block text-xl font-[500] mb-2'>
              Sizes (comma separated)
            </label>
            <input
              type='text'
              {...register('sizes')}
              className='w-full border border-[#77846a] rounded-lg p-2 outline-none'
              placeholder='1kg, 2kg, 3kg'
            />
          </div>
        </div>

        {/*  Checkboxes */}
        <div className='flex items-center gap-6'>
          <label className='flex items-center gap-2 text-xl font-[500]'>
            <input
              type='checkbox'
              checked={bestseller}
              onChange={() => setBestseller((prev) => !prev)}
              className='w-4 h-4 accent-[#2a4125]'
            />
            Best Seller
          </label>

          <label className='flex items-center gap-2 text-xl font-[500]'>
            <input
              type='checkbox'
              checked={deal}
              onChange={() => setDeal((prev) => !prev)}
              className='w-4 h-4 accent-[#2a4125]'
            />
            Deal
          </label>
        </div>

        {/* Dropdown */}
        <div>
          <label className='block mb-2 text-xl font-[500]'>Category</label>
          <select
            {...register('category', { required: true })}
            className='w-full border border-[#77846a] rounded-lg p-2 outline-none'
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
