import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, thunkAPI) => {
    try {
      return await authService.checkAuth();
    } catch (error) {
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (userData, thunkAPI) => {
    try {
      return await authService.adminLogin(userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Admin login failed';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAdmin = action.payload.role === 'admin';
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAdmin = action.payload.role === 'admin';
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isAdmin = false;
      })
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAdmin = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;