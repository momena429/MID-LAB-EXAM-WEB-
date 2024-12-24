const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user.model'); // Adjust path as needed
const expressLayouts = require('express-ejs-layouts');
const Product = require('./models/product.model');
const Order = require('./models/order.model');
const categoryRoutes = require("./routes/admin/categoryRoutes");
const productsRoutes = require("./routes/admin/productsRoutes");
const ordersRoutes = require('./routes/admin/ordersRoutes');
const cartRoutes = require('./routes/cartRoutes')
const methodOverride = require("method-override");
const path = require("path");

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Momena', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB!');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
// Middleware
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(session({
  secret: 'your-secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Configure session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});




// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set EJS as template engine
app.set('view engine', 'ejs');

// Routes
app.use("/admin", productsRoutes);
app.use("/categories", categoryRoutes);
app.use('/admin/orders', ordersRoutes);
app.use(cartRoutes);

// Home page (protected)
app.get('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  try {
    const products = await Product.find();
    res.render('home', { layout: 'layout', products });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error fetching products');
    res.redirect('/');
  }
});

// Login page (no header/footer)
app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('login', { layout: false }); // No layout, only login page
});

// Register page (no header/footer)
app.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('register', { layout: false }); // No layout, only register page
});

// Register form submission
app.post('/register', async (req, res) => {
  const { username, email, password, password2, isAdmin } = req.body;

  if (password !== password2) {
    req.flash('error_msg', 'Passwords do not match');
    return res.redirect('/register');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error_msg', 'Email already registered');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: isAdmin === 'on' ? true : false,
    });

    await newUser.save();

    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error registering user');
    res.redirect('/register');
  }
});

// POST route for login
app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

// Logout
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash('error_msg', 'Error logging out');
      return res.redirect('/');
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});


// Cart route
app.get('/cart', (req, res) => {
  res.render('admin/cart', { layout: 'layout' }); // Render cart.ejs with header/footer
});

// app.get('/cart', (req, res) => {
//   const cart = req.session.cart || []; // Only show items in the cart
//   res.render('admin/categories/cart', { layout: 'layout', cart });
// });


// // Admin Routes
// app.use('/admin', productsRoutes); // Handles admin-only actions (product/category management)

// // User Routes
// app.use('/cart', cartRoutes); // Handles cart functionality


// Passport configuration
require('./config/passport-config')(passport);

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
