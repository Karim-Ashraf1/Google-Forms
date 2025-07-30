const authMiddleware = (req, res, next) => {
  var username = req.body.username || req.headers.username;

  if (!username) {
    console.error('No username found in request');
    return res.status(401).json({ message: 'Username required' });
  }
  
  req.user = { username: username };
  console.log('User authenticated:', username);
  next();
};

export default authMiddleware;

