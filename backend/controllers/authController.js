import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//signup user controller function
export const signupUser = async (req, res) => {
    try{
        const {name, email, password} = req.body; 
        //check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }
        //hash the password 
        const hashedPassword = await bcrypt.hash(password, 10);
        //create new user   
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({message: 'User created successfully'});
    }
    catch(error) {
        res.status(500).json({message: 'Server error', error});
    }   
};

//login user controller function
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body; 
        //check if user exists
        const user = await User.findOne({
            email
        }); 
        if(!user) {
            return res.status(400).json({message: 'User not found'});
        }
        //compare password
        const isMatch = await bcrypt.compare(password, user.password);  //bcrypt.compare will return true if the password matches the hashed password stored in the database, and false otherwise.
        if(!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        //create and sign JWT token
        const token = jwt.sign( //jwt.sign is used to create a new JSON Web Token. It takes three arguments: the payload (in this case, an object containing the user's ID), the secret key (which is used to sign the token and should be kept secure), and an options object (where we specify that the token should expire in 1 day).
            {userId: user._id}, 
            process.env.JWT_SECRET, 
            {expiresIn: '1d'}
        );
        res.status(200).json(
            {
                token,
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
    }
    catch(error) {
        res.status(500).json({message: 'Server error', error});     
    }
};
