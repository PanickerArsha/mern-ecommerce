import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../api/axios.js';

const initialState = {
  list: [],
  status: 'idle',
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await api.get('/products');
    return response.data.categoryList || [];
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories(state, action) {
      state.list = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    clearCategories(state) {
      state.list = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setCategories, clearCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
