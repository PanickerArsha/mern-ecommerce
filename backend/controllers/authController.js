import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//signup user controller function
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//login user controller function
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if user exists
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password); //bcrypt.compare will return true if the password matches the hashed password stored in the database, and false otherwise.
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //create and sign JWT token
    const token = jwt.sign(
      //jwt.sign is used to create a new JSON Web Token. It takes three arguments: the payload (in this case, an object containing the user's ID), the secret key (which is used to sign the token and should be kept secure), and an options object (where we specify that the token should expire in 1 day).
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.status(200).json({
      token,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//google login controller function
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
//The verifyIdToken method of the OAuth2Client is used to verify the integrity and authenticity of the ID token received from the client. It checks that the token is valid, has not expired, and was issued for our application (by checking the audience). If the token is valid, it returns a ticket containing the user's information (payload) extracted from the token, which we can then use to find or create a user in our database.
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
// getpayload method is used to extract the user's information (such as name, email, picture, and Google ID) from the verified token. This information is then used to check if a user with the given email already exists in our database. If not, a new user is created with the extracted information. Finally, a JWT token is generated for the user and sent back in the response along with a success message and user details.
    const payload = ticket.getPayload();

    const { name, email, picture, sub } = payload;

    let user = await User.findOne({
      email,
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,//sub is the id of the user in Google's system, which is unique for each user. Storing this allows us to identify users who log in with Google in the future and link them to their existing account if they use the same email.
        avatar: picture, //picture is the URL of the user's profile picture on Google. Storing this allows us to display the user's Google profile picture in our application, providing a more personalized experience for users who log in with Google.
      });
    }

    const JWTtoken = jwt.sign(
      //jwt.sign is used to create a new JSON Web Token. It takes three arguments: the payload (in this case, an object containing the user's ID), the secret key (which is used to sign the token and should be kept secure), and an options object (where we specify that the token should expire in 1 day).
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    
    res.status(200).json({
      token: JWTtoken,
      message: "Google successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(401).json({
      message: "Google authentication failed",
    });
  }
};
