// // routes/authRoutes.js
// const express = require('express');
// const passport = require('passport');
// const User = require('../models/user.model');
// const router = express.Router();

// // Registration Route
// router.get('/register', (req, res) => {
//   res.render('register');
// });

// router.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const userExists = await User.findOne({ username });
//     if (userExists) {
//       return res.status(400).send('Username already exists');
//     }

//     const newUser = new User({ username, password });
//     await newUser.save();
//     res.redirect('/login');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });


// // Login Route
// router.get('/login', (req, res) => {
//   res.render('login');
// });

// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true
// }));

// // Logout Route
// router.get('/logout', (req, res) => {
//   req.logout((err) => {
//     if (err) return next(err);
//     res.redirect('/');
//   });
// });

// module.exports = router;
const express = require('express');
const passport = require('passport');
const User = require('../models/user.model');
const router = express.Router();

// Registration Route
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error('Error during registration:', error);
    req.flash('error', 'Internal Server Error.');
    res.redirect('/register');
  }
});

// Login Route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

// Logout Route
router.get('/logout', async (req, res, next) => {
  try {
    await req.logout();
    req.session.destroy((err) => {
      if (err) return next(err);
      res.redirect('/');
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
