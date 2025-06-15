import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';
import { toast } from 'react-toastify';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      return await userService.getUsers();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateUserStatus',
  async ({ userId, isBlocked }, thunkAPI) => {
    try {
      const result = await userService.updateUserStatus(userId, isBlocked);
      toast.success(`User ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
      return result;
    } catch (error) {
      toast.error('Failed to update user status');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export default userSlice.reducer;