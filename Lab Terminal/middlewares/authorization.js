// module.exports = function (req, res, next) {
//   if (req.isAuthenticated() && req.user.isAdmin) {
//     return next();
//   }
//   req.flash('error_msg', 'You are not authorized to view this page');
//   res.redirect('/login');
// };
module.exports = function (req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  req.flash('error', 'You are not authorized to view this page.');
  res.redirect('/login');
};

module.exports.isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Please log in to add to wishlist.' });
  }
  next();
};
