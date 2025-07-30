import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const signup = async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    var existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: 'This account already exists. Please log in.' });
    }

    var hash = await bcrypt.hash(password, 8);
    var user = new User({ username: username, password: hash, forms: [] });
    await user.save();
    
    res.json({ message: 'Signup success' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
};


const login = async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  try {
    var user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this username.' });
    }

    var same = await bcrypt.compare(password, user.password);
    if (!same) {
      return res.status(400).json({ message: 'Incorrect password. Please try again.' });
    }

    res.json({ message: 'Login success', user: { username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
};

export { signup, login };