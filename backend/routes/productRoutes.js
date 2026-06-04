import express from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

//route for creating a new product
router.post('/add', createProduct); //when a post request is made to /add, the createProduct function from productController will be called to handle the request and response.

//route for getting all products
router.get('/', getProducts); //when a get request is made to /, the getProducts function from productController will be called to handle the request and response.

//route for updating a product update/{mongoibid} put--> for changes anyone value of the product eg. price, name, description, etc.
//for changing full product details we can use patch method instead of put method
router.put('/update/:id', updateProduct); //when a put request is made to /update/:id, the updateProduct function from productController will be called to handle the request and response.

//route for deleting a product delete/{mongoibid}
router.delete('/delete/:id', deleteProduct); //when a delete request is made to /delete/:id, the deleteProduct function from productController will be called to handle the request and response.

export default router;