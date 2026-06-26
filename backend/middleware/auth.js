const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this');
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this');
    req.userId = decoded.id;
    req.userType = decoded.type;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateAdmin, authenticateUser };
