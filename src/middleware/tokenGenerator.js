import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Token expiration time
    );
};

export default generateToken;
