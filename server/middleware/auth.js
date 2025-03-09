import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
    console.log('Auth middleware called');
    console.log('Headers:', req.headers);
    
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);
    
    if (!authHeader) {
        console.log('No authorization header found');
        return res.status(401).json({ message: 'No authorization header' });
    }

    if (!authHeader.startsWith('Bearer ')) {
        console.log('Invalid token format - missing Bearer prefix');
        return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);
    
    if (!token) {
        console.log('No token found after Bearer prefix');
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully:', decoded);
        
        if (!decoded.username) {
            console.log('Token missing username');
            return res.status(403).json({ message: 'Invalid token: missing username' });
        }

        req.user = { username: decoded.username };
        console.log('User set in request:', req.user);
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(403).json({ message: 'Invalid token: ' + err.message });
    }
}; 