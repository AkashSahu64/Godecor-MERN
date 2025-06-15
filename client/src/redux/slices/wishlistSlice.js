import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from '../../services/wishlistService';
import { toast } from 'react-toastify';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, thunkAPI) => {
    try {
      return await wishlistService.getWishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, thunkAPI) => {
    try {
      const result = await wishlistService.addToWishlist(productId);
      toast.success('Added to wishlist');
      return result;
    } catch (error) {
      toast.error('Failed to add to wishlist');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, thunkAPI) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      toast.success('Removed from wishlist');
      return productId;
    } catch (error) {
      toast.error('Failed to remove from wishlist');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;