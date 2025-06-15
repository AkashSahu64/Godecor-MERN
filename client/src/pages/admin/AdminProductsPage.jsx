import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash, X, Upload, Check } from 'lucide-react';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../redux/slices/productSlice';
import { fetchCategories } from '../../redux/slices/categorySlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const initialProductState = {
    name: '',
    description: '',
    price: 0,
    category: '',
    countInStock: 0,
    imageUrl: '',
    featured: false,
  };
  
  const [productForm, setProductForm] = useState(initialProductState);
  
  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchCategories());
  }, [dispatch]);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);
  
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      await dispatch(updateProduct({ id: editingProduct.id, productData: productForm }));
    } else {
      await dispatch(createProduct(productForm));
    }
    setShowAddForm(false);
    setEditingProduct(null);
    setProductForm(initialProductState);
  };
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowAddForm(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(id));
    }
  };
  
  const ProductForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="glass-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-dark-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={() => {
              setShowAddForm(false);
              setEditingProduct(null);
              setProductForm(initialProductState);
            }}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={productForm.name}
                onChange={handleFormChange}
                className="input w-full"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={productForm.description}
                onChange={handleFormChange}
                rows="3"
                className="input w-full"
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="price" className="form-label">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={productForm.price}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  className="input w-full"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="countInStock" className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  id="countInStock"
                  name="countInStock"
                  value={productForm.countInStock}
                  onChange={handleFormChange}
                  min="0"
                  className="input w-full"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                name="category"
                value={productForm.category}
                onChange={handleFormChange}
                className="input w-full"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="imageUrl" className="form-label">Image URL</label>
              <div className="flex">
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={productForm.imageUrl}
                  onChange={handleFormChange}
                  className="input w-full rounded-r-none"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <button
                  type="button"
                  className="bg-dark-600 px-4 rounded-r-lg flex items-center"
                  title="Upload Image"
                >
                  <Upload size={20} />
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={productForm.featured}
                  onChange={handleFormChange}
                  className="form-checkbox h-5 w-5 text-primary-600"
                />
                <span>Featured Product</span>
              </label>
            </div>
            
            {productForm.imageUrl && (
              <div className="form-group">
                <label className="form-label">Image Preview</label>
                <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-dark-700">
                  <img
                    src={productForm.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingProduct(null);
                setProductForm(initialProductState);
              }}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={loading}
            >
              <Check size={20} className="mr-2" />
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
  
  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Products</h1>
          <p className="text-gray-400">Manage your product inventory</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full sm:w-64"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            Add Product
          </button>
        </div>
      </div>
      
      {loading && !products.length ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="py-4 px-6 text-left">Product</th>
                  <th className="py-4 px-6 text-left">Category</th>
                  <th className="py-4 px-6 text-left">Price</th>
                  <th className="py-4 px-6 text-left">Stock</th>
                  <th className="py-4 px-6 text-left">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-400">
                      {searchTerm
                        ? 'No products found matching your search'
                        : 'No products available'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-dark-700/50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-gray-400 text-sm truncate max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 capitalize">{product.category}</td>
                      <td className="py-4 px-6">${product.price.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.countInStock === 0
                              ? 'bg-red-500/20 text-red-500'
                              : product.countInStock < 5
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-green-500/20 text-green-500'
                          }`}
                        >
                          {product.countInStock === 0
                            ? 'Out of stock'
                            : `${product.countInStock} in stock`}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {product.featured ? (
                          <span className="bg-primary-500/20 text-primary-500 px-2 py-1 rounded-full text-xs">
                            Featured
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Product"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <AnimatePresence>
        {showAddForm && <ProductForm />}
      </AnimatePresence>
    </div>
  );
};

export default AdminProductsPage;