import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';
import { toast } from 'react-toastify';
import { clearCart } from './cartSlice';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, thunkAPI) => {
    try {
      const result = await orderService.createOrder(orderData);
      thunkAPI.dispatch(clearCart());
      toast.success('Order placed successfully');
      return result;
    } catch (error) {
      toast.error('Failed to place order');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, thunkAPI) => {
    try {
      return await orderService.getUserOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, thunkAPI) => {
    try {
      return await orderService.getAllOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, thunkAPI) => {
    try {
      const result = await orderService.updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      return result;
    } catch (error) {
      toast.error('Failed to update order status');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  orders: [],
  userOrders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.userOrders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        
        const userOrderIndex = state.userOrders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (userOrderIndex !== -1) {
          state.userOrders[userOrderIndex] = action.payload;
        }
        
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      });
  },
});

export const { setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;