import express from "express";
import {signupUser,loginUser,googleLogin} from "../controllers/authController.js";
const router = express.Router();

//route for user signup
router.post('/signup', signupUser); //when a post request is made to /signup, the signupUser function from authController will be called to handle the request and response.
router.post('/login', loginUser); //when a post request is made to /login, the loginUser function from authController will be called to handle the request and response.
router.post('/google', googleLogin); //when a post request is made to /google, the googleLogin function from authController will be called to handle the request and response.

export default router;
