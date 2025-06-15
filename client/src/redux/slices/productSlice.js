import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';
import { toast } from 'react-toastify';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters, thunkAPI) => {
    try {
      return await productService.getProducts(filters);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, thunkAPI) => {
    try {
      return await productService.getFeaturedProducts();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, thunkAPI) => {
    try {
      return await productService.getProductById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, thunkAPI) => {
    try {
      const result = await productService.createProduct(productData);
      toast.success('Product created successfully');
      return result;
    } catch (error) {
      toast.error('Failed to create product');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, thunkAPI) => {
    try {
      const result = await productService.updateProduct(id, productData);
      toast.success('Product updated successfully');
      return result;
    } catch (error) {
      toast.error('Failed to update product');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, thunkAPI) => {
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      return id;
    } catch (error) {
      toast.error('Failed to delete product');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
    sort: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
      });
  },
});

export const { setFilters, setPagination, resetFilters } = productSlice.actions;
export default productSlice.reducer;