// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { backendUrl } from '../layout/Main';
// import { useOutletContext } from 'react-router-dom';
// import { toast } from 'react-toastify';

// export default function ListProducts() {
//   const { token } = useOutletContext();
//   const [list, setList] = useState([]);

//   // Fetch products
//   const fetchList = async () => {
//     try {
//       const response = await axios.get(backendUrl + '/api/product/list', {
//         headers: { token },
//       });
//       if (response.data.success) {
//         setList(response.data.products);
//         console.log(response.data);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error.message);
//     }
//   };

//   // Delete product
//   const deleteProduct = async (id) => {
//     try {
//       const response = await axios.post(
//         backendUrl + '/api/product/remove',
//         { id },
//         { headers: { token } }
//       );
//       if (response.data.success) {
//         toast.success('Product deleted successfully!');
//         await fetchList();
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, []);

//   return (
//     <div className='p-6 mt-2'>
//       {/* Heading */}
//       <div className='max-w-6xl mx-auto px-4 text-left'>
//         <h2 className='text-4xl sm:text-5xl md:text-6xl text-[#2a4125] leading-snug'>
//           List Products
//         </h2>
//       </div>

//       {/* Table headers */}
//       <div className='max-w-6xl mx-auto mr-4 mt-10 grid grid-cols-5 text-[#77846a] text-sm font-medium py-5 pb-8'>
//         <p>IMAGE</p>
//         <p>NAME</p>
//         <p>CATEGORY</p>
//         <p>PRICE</p>
//         <p className='text-center'>DELETE</p>
//       </div>
//       <hr className='border border-[#77846a]/20' />

//       {/* Product List */}
//       <div className='max-w-6xl mx-auto mt-4 space-y-6'>
//         {list.map((product) => (
//           <div key={product._id} className='grid grid-cols-5 items-center pb-4'>
//             {/* Image */}
//             <div className='flex items-center'>
//               <img
//                 src={product.image[0]}
//                 alt={product.name}
//                 className='w-28 h-28 object-cover rounded-lg shadow border-2 border-[#2a4125]'
//               />
//             </div>

//             {/* Name */}
//             <div>
//               <h3 className='text-lg text-[#2a4125]'>{product.name}</h3>
//             </div>

//             {/* Category */}
//             <div>
//               <p className=' text-lg text-[#2a4125]'>{product.category}</p>
//             </div>

//             {/* Price */}
//             <div>
//               <p className='text-lg font-medium text-[#2a4125]'>
//                 Rs.{product.price}.00 PKR
//               </p>
//             </div>

//             {/* Action */}
//             <div className='text-center'>
//               <button
//                 onClick={() => deleteProduct(product._id)}
//                 className='text-[#3d081b] hover:text-red-800 cursor-pointer'
//               >
//                 🗑️
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../layout/Main';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function ListProducts() {
  const { token } = useOutletContext();
  const queryClient = useQueryClient();

  // Fetch products with React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'], // cache key
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { token },
      });
      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }
      return response.data.products;
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );
      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success('Product deleted successfully!');
      queryClient.invalidateQueries(['products']); // refetch products after delete
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });

  if (isLoading)
    return <p className='text-center mt-10'>Loading products...</p>;
  if (isError)
    return (
      <p className='text-center mt-10 text-red-600'>Failed to load products</p>
    );

  return (
    <div className='p-6 mt-2'>
      {/* Heading */}
      <div className='max-w-6xl mx-auto px-4 text-left'>
        <h2 className='text-4xl sm:text-5xl md:text-6xl text-[#2a4125] leading-snug'>
          List Products
        </h2>
      </div>

      {/* Table headers */}
      <div className='max-w-6xl mx-auto mr-4 mt-10 grid grid-cols-5 text-[#77846a] text-sm font-medium py-5 pb-8'>
        <p>IMAGE</p>
        <p>NAME</p>
        <p>CATEGORY</p>
        <p>PRICE</p>
        <p className='text-center'>DELETE</p>
      </div>
      <hr className='border border-[#77846a]/20' />

      {/* Product List */}
      <div className='max-w-6xl mx-auto mt-4 space-y-6'>
        {data?.map((product) => (
          <div key={product._id} className='grid grid-cols-5 items-center pb-4'>
            {/* Image */}
            <div className='flex items-center'>
              <img
                src={product.image[0]}
                alt={product.name}
                className='w-28 h-28 object-cover rounded-lg shadow border-2 border-[#2a4125]'
              />
            </div>

            {/* Name */}
            <div>
              <h3 className='text-lg text-[#2a4125]'>{product.name}</h3>
            </div>

            {/* Category */}
            <div>
              <p className='text-lg text-[#2a4125]'>{product.category}</p>
            </div>

            {/* Price */}
            <div>
              <p className='text-lg font-medium text-[#2a4125]'>
                Rs.{product.price}.00 PKR
              </p>
            </div>

            {/* Action */}
            <div className='text-center'>
              <button
                onClick={() => deleteMutation.mutate(product._id)}
                className='text-[#3d081b] hover:text-red-800 cursor-pointer'
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
