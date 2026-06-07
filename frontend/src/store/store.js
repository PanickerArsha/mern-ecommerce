import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './features/product/categoriesSlice.js';
import productsReducer from './features/product/productSlice.js';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
  },
});
