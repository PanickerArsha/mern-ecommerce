import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../api/axios.js';

const initialState = {
  list: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ search = '', category = '' } = {}) => {
    const response = await api.get('/products', {
      params: { search, category },
    });
    return response.data.products || [];
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.list = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    clearProducts(state) {
      state.list = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setProducts, clearProducts } = productSlice.actions;
export default productSlice.reducer;
