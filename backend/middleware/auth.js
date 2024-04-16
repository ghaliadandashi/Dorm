const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).send('No token provided');
        }
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).send('Invalid token');
    }
};
const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) return res.status(403).send('Unauthorized');
        next();
    };
};
module.exports = checkRole;
module.exports = authenticateToken;
