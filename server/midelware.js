import jwt from 'jsonwebtoken';
import  {adminModel}  from './model/adminModel.js'; 

const isadminlogin = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ isadminlogin: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const admin = await adminModel.findOne({ email: decoded.email });
        if (!admin) {
            return res.status(403).json({ isadminlogin: false, message: 'Invalid token or not an admin' });
        }

        req.email = decoded.email;
        req.roll = decoded.roll;
        next();

    } catch (err) {
        return res.status(401).json({ isadminlogin: false, message: 'Failed to authenticate token', error: err.message });
    }
};

export default isadminlogin;
