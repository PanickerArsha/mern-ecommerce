import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import addressRoutes from './routes/addressRoutes.js';

dotenv.config();

const app = express();

app.use(cors()); //enable cors to connect frontend and backend
app.use(express.json()); //to parse json data from request body to make api
app.use('/api/auth', authRoutes); //when a request is made to /api/auth, the authRoutes will handle the request and response. This means that any request to /api/auth will be routed to the authRoutes, which will then determine how to handle the request based on the defined routes in authRoutes.js.
app.use('/api/products', productRoutes); //when a request is made to /api/products, the productRoutes will handle the request and response. This means that any request to /api/products will be routed to the productRoutes, which will then determine how to handle the request based on the defined routes in productRoutes.js.
app.use('/api/cart', cartRoutes); //when a request is made to /api/cart, the cartRoutes will handle the request and response. This means that any request to /api/cart will be routed to the cartRoutes, which will then determine how to handle the request based on the defined routes in cartRoutes.js.
app.use('/api/address', addressRoutes); //when a request is made to /api/addresses, the addressRoutes will handle the request and response. This means that any request to /api/addresses will be routed to the addressRoutes, which will then determine how to handle the request based on the defined routes in addressRoutes.js.

app.get('/', (req, res) => {
  res.send('API is running!');
});

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
