const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  // ... your existing login logic
  
  // After successful authentication
  const token = jwt.sign(
    { userId: user._id }, 
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};
