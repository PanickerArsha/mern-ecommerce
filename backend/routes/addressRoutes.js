import express from "express";
import { saveAddress,getAddresses} from "../controllers/addressController.js";

const router = express.Router();

//route for saving address
router.post('/add', saveAddress); //when a post request is made to /add, the saveAddress function from addressController will be called to handle the request and response.
//route for fetching address by userId
router.get('/:userId', getAddresses); //when a get request is made to /:userId, the getAddresses function from addressController will be called to handle the request and response. The :userId is a route parameter that will be used to fetch addresses for a specific user.

export default router;