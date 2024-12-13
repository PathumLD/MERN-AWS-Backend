import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) =>{
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password : hashedPassword });

    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully"});
    } catch (error) {
        next(error);
    } 
};

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401, 'Invalid credentials'));
        // Create token
        const token = jwt.sign({_id: validUser._id}, process.env.JWT_SECRET);
        const { password: hashedPassword, ...rest } = validUser._doc; //_doc is for avoid unnecessary data
        const expiryDate = new Date(Date.now() + 3600000); //1 hour
        res
        .cookie('access_token', token, { 
            httpOnly: true, 
            expires: expiryDate 
        })
        .status(200)
        .json(rest)
    } catch (error) {
        next(error);
    }
}


// Google Authentication 

export const google = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password: hashedPassword, ...rest } = user._doc;
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res
          .cookie('access_token', token, {
            httpOnly: true,
            expires: expiryDate,
          })
          .status(200)
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            req.body.name.split(' ').join('').toLowerCase() +
            Math.random().toString(36).slice(-8),
          email: req.body.email,
          password: hashedPassword,
          profilePicture: req.body.photo,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: hashedPassword2, ...rest } = newUser._doc;
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res
          .cookie('access_token', token, {
            httpOnly: true,
            expires: expiryDate,
          })
          .status(200)
          // .json(rest)
          .redirect('/dashboard');
      }
    } catch (error) {
      next(error);
    }
  };


// Facebook Authentication
export const facebook = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;

    // Check if the email already exists in the database
    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      // If the email doesn't exist, create a new user account for Facebook login
      const generatedPassword = Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      
      const newUser = new User({
        username: name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8),
        email,
        password: hashedPassword,
        profilePicture: photo,
      });

      existingUser = await newUser.save();
    }

    // Generate token for the user and return user data
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword2, ...rest } = existingUser._doc;

    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};




// Signout
export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
};

