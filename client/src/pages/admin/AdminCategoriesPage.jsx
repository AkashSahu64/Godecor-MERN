import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Search, X, Edit, Trash, Check } from 'lucide-react';
import {
  fetchCategories,
  createCategory,
  deleteCategory,
} from '../../redux/slices/categorySlice';
import { openModal, closeModal } from '../../redux/slices/uiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminCategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  
  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Filter categories when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);
  
  const initialCategoryState = {
    name: '',
    description: '',
  };
  
  const [categoryForm, setCategoryForm] = useState(initialCategoryState);
  
  const handleAddCategory = () => {
    setCategoryForm(initialCategoryState);
    
    dispatch(
      openModal({
        type: 'default',
        content: renderCategoryForm(),
      })
    );
  };
  
  const handleDeleteCategory = (category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      dispatch(deleteCategory(category.id));
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmitCategory = (e) => {
    e.preventDefault();
    
    dispatch(createCategory(categoryForm))
      .unwrap()
      .then(() => {
        dispatch(closeModal());
      });
  };
  
  const renderCategoryForm = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
      <form onSubmit={handleSubmitCategory}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={categoryForm.name}
            onChange={handleFormChange}
            className="input w-full"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={categoryForm.description}
            onChange={handleFormChange}
            rows="3"
            className="input w-full"
            required
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="btn-outline"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary flex items-center">
            {loading ? (
              'Saving...'
            ) : (
              <>
                <Check size={16} className="mr-2" />
                Add Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
  
  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Categories</h1>
          <p className="text-gray-400">Manage product categories</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full sm:w-64"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
            onClick={handleAddCategory}
            className="btn-primary flex items-center justify-center"
          >
            <Plus size={16} className="mr-2" />
            Add Category
          </button>
        </div>
      </div>
      
      {loading && !categories.length ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredCategories.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <p className="text-gray-400">
                {searchTerm
                  ? 'No categories found matching your search'
                  : 'No categories available'}
              </p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <p className="text-gray-400 mt-1">{category.description}</p>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Slug: {category.slug}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Category"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;