import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

export const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

export const protect = () => expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => {
    if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  },
}).unless({ path: ['/api/auth/login', '/api/auth/register'] }); // Add paths that don't require authentication

