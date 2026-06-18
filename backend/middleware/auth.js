const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Check if the authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // Extract the token
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // CRITICAL: Attach the decoded user payload to the request object.
    // This is what prevents IDOR vulnerabilities — we never trust client-sent userId.
    req.user = decoded;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
