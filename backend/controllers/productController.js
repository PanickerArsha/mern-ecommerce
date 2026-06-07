import Product from '../models/Product.js';

//create product controller function
export const createProduct = async (req, res) => {
    try {   
        //create new product
        const product = await Product.create(req.body); 
        res.json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

//get all products controller function
export const getProducts = async (req, res) => {
    try {
        //get search and category from query parameters
        const {search,category} = req.query;
        let filter = {};
        if(search) {
            //in thunderclient, we can pass search and category as query parameters like this: http://localhost:5000/api/products?search=phone&category=electronics
            filter.title = {$regex: search, $options: 'i'}; //case-insensitive search
        }
        if(category) {
            filter.category = category;
        }
        //get all products and sort by createdAt in descending order
        const products = await Product.find(filter).sort({createdAt: -1});
        //get distinct categories from products collection
        const categoryList = await Product.distinct('category');
        res.json({products, categoryList});
    } catch (error) {
    res.status(400).json({message: error.message});
    }
};

//update product controller function
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true} //this option returns the updated document rather than the original document
        );
        res.json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

//delete product controller function
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({message: 'Product deleted successfully'});
    } catch (error) {
        res.status(400).json({message: error.message});
    }   
};