import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import uiReducer from './slices/uiSlice';
import wishlistReducer from './slices/wishlistSlice';
import categoryReducer from './slices/categorySlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    orders: orderReducer,
    ui: uiReducer,
    wishlist: wishlistReducer,
    categories: categoryReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});