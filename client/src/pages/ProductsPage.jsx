import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { fetchProducts, setFilters, resetFilters, setPagination } from '../redux/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProductsPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const dispatch = useDispatch();
  const { products, loading, filters, pagination } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { searchQuery } = useSelector((state) => state.ui);
  
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const ratingParam = searchParams.get('rating');
    const sortParam = searchParams.get('sort');
    
    const initialFilters = {};
    
    if (categoryParam) initialFilters.category = categoryParam;
    if (minPriceParam) initialFilters.minPrice = Number(minPriceParam);
    if (maxPriceParam) initialFilters.maxPrice = Number(maxPriceParam);
    if (ratingParam) initialFilters.rating = Number(ratingParam);
    if (sortParam) initialFilters.sort = sortParam;
    
    if (Object.keys(initialFilters).length > 0) {
      dispatch(setFilters(initialFilters));
    }
  }, [searchParams, dispatch]);
  
  useEffect(() => {
    dispatch(fetchProducts({ ...filters, ...pagination }));
    
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice > 0) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice < 1000) params.set('maxPrice', filters.maxPrice);
    if (filters.rating > 0) params.set('rating', filters.rating);
    if (filters.sort) params.set('sort', filters.sort);
    
    setSearchParams(params);
  }, [filters, pagination, dispatch, setSearchParams]);
  
  useEffect(() => {
    if (searchQuery) {
      dispatch(setFilters({ search: searchQuery }));
    }
  }, [searchQuery, dispatch]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    
    if (name === 'minPrice' || name === 'maxPrice' || name === 'rating') {
      parsedValue = Number(value);
    }
    
    dispatch(setFilters({ [name]: parsedValue }));
  };
  
  const handleResetFilters = () => {
    dispatch(resetFilters());
    setSearchParams({});
  };
  
  const handleChangePage = (page) => {
    dispatch(setPagination({ page }));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              <Filter size={16} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          <motion.aside
            className={`glass-card w-full md:w-64 shrink-0 ${
              showFilters ? 'block' : 'hidden md:block'
            }`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 border-b border-dark-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <SlidersHorizontal size={18} className="mr-2" />
                Filters
              </h2>
              <button
                onClick={handleResetFilters}
                className="text-sm text-primary-400 hover:underline flex items-center"
              >
                <X size={14} className="mr-1" />
                Reset
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-400">Min</label>
                    <input
                      type="number"
                      name="minPrice"
                      min="0"
                      max="1000"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Max</label>
                    <input
                      type="number"
                      name="maxPrice"
                      min="0"
                      max="1000"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="input w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Rating</h3>
                <select
                  name="rating"
                  value={filters.rating}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Sort By</h3>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="">Relevance</option>
                  <option value="price-low-to-high">Price: Low to High</option>
                  <option value="price-high-to-low">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </motion.aside>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-display font-semibold">
                {filters.category
                  ? `${filters.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`
                  : 'All Plants'}
              </h1>
              <div className="text-sm text-gray-400">
                {pagination.total} products
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : products.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <h2 className="text-xl font-semibold mb-2">No products found</h2>
                <p className="text-gray-400 mb-4">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn-primary"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
                
                {pagination.total > pagination.limit && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex space-x-2">
                      {Array.from(
                        { length: Math.ceil(pagination.total / pagination.limit) },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => handleChangePage(page)}
                          className={`w-10 h-10 rounded-full ${
                            pagination.page === page
                              ? 'bg-primary-600 text-white'
                              : 'bg-dark-700 hover:bg-dark-600 text-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsPage;