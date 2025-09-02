import ProductsPageTitle from '../ui/ProductsPageTitle';
import ProductItem from '../ui/ProductItem';
import { useContext, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import FilterBar from '../ui/FilterBar';
import { useProductFilter } from '../hooks/useProductFilter';

export default function ProductsPage() {
  const { products, search } = useContext(ShopContext);

  // 🔹 first filter with custom hook
  const { filteredProducts, setFilters } = useProductFilter(products);

  // 🔹 then apply search filter on top
  const searchedProducts = useMemo(() => {
    if (!search) return filteredProducts;
    return filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, filteredProducts]);

  return (
    <div className='my-10 sm:my-15'>
      <ProductsPageTitle title='Products' />

      {/* Filter bar */}
      <div className='mb-6 px-4'>
        <FilterBar
          setFilters={setFilters}
          maxPrice={Math.max(...products.map((p) => p.price))}
          productCount={searchedProducts.length} // count after search + filter
        />
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-6 ml-14'>
        {searchedProducts.length > 0 ? (
          searchedProducts.map((product) => (
            <ProductItem
              product={product}
              key={product._id}
              id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))
        ) : (
          <p className='text-center text-gray-500 col-span-full'>
            No products found 😔
          </p>
        )}
      </div>
    </div>
  );
}
