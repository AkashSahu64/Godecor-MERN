import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';
import { toast } from 'react-toastify';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, thunkAPI) => {
    try {
      return await cartService.getCart();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productData, thunkAPI) => {
    try {
      const result = await cartService.addToCart(productData);
      toast.success('Added to cart');
      return result;
    } catch (error) {
      toast.error('Failed to add to cart');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, thunkAPI) => {
    try {
      return await cartService.updateCartItem(productId, quantity);
    } catch (error) {
      toast.error('Failed to update cart');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, thunkAPI) => {
    try {
      await cartService.removeFromCart(productId);
      toast.success('Item removed from cart');
      return productId;
    } catch (error) {
      toast.error('Failed to remove from cart');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, thunkAPI) => {
    try {
      await cartService.clearCart();
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    calculateTotal: (state) => {
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Check if the item already exists in the cart
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          // If it exists, update the quantity
          state.items[index].quantity += action.payload.quantity;
        } else {
          // If it doesn't exist, add it to the cart
          state.items.push(action.payload);
        }
        // Calculate the new total
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index].quantity = action.payload.quantity;
        }
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => item.id !== action.payload
        );
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
      });
  },
});

export const { calculateTotal } = cartSlice.actions;
export default cartSlice.reducer;