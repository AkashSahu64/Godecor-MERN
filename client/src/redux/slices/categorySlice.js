import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from '../../services/categoryService';
import { toast } from 'react-toastify';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, thunkAPI) => {
    try {
      return await categoryService.getCategories();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, thunkAPI) => {
    try {
      const result = await categoryService.createCategory(categoryData);
      toast.success('Category created successfully');
      return result;
    } catch (error) {
      toast.error('Failed to create category');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, thunkAPI) => {
    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted successfully');
      return id;
    } catch (error) {
      toast.error('Failed to delete category');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  categories: [
    {
      id: '1',
      name: 'Indoor',
      slug: 'indoor',
      description: 'Perfect artificial plants for indoor decoration',
      imageUrl: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '2',
      name: 'Outdoor',
      slug: 'outdoor',
      description: 'Weather-resistant artificial plants for outdoor spaces',
      imageUrl: 'https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '3',
      name: 'Bonsai',
      slug: 'bonsai',
      description: 'Artificial bonsai trees for zen decoration',
      imageUrl: 'https://images.pexels.com/photos/4751969/pexels-photo-4751969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '4',
      name: 'Large Plants',
      slug: 'large-plants',
      description: 'Impressive artificial large plants for statement pieces',
      imageUrl: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '5',
      name: 'Small Plants',
      slug: 'small-plants',
      description: 'Delicate artificial small plants for any space',
      imageUrl: 'https://images.pexels.com/photos/4503751/pexels-photo-4503751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '6',
      name: 'Hanging Plants',
      slug: 'hanging-plants',
      description: 'Beautiful artificial hanging plants for vertical spaces',
      imageUrl: 'https://images.pexels.com/photos/1084188/pexels-photo-1084188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '7',
      name: 'Artificial Trees',
      slug: 'artificial-trees',
      description: 'Lifelike artificial trees for indoor and outdoor spaces',
      imageUrl: 'https://images.pexels.com/photos/1034394/pexels-photo-1034394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '8',
      name: 'Artificial Flowers',
      slug: 'artificial-flowers',
      description: 'Stunning artificial flowers that never wilt',
      imageUrl: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    }
  ],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          category => category.id !== action.payload
        );
      });
  },
});

export default categorySlice.reducer;