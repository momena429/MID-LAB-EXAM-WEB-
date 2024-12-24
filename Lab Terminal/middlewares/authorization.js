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
