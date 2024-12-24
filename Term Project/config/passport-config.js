// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcrypt');
// const User = require('../models/user.model'); // Adjust path as needed

// module.exports = function(passport) {
//   passport.use(new LocalStrategy(
//     { usernameField: 'email' },  // Assuming you're using email for login
//     async (email, password, done) => {
//       try {
//         const user = await User.findOne({ email });

//         if (!user) {
//           return done(null, false, { message: 'Invalid email or password' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (isMatch) {
//           return done(null, user);
//         } else {
//           return done(null, false, { message: 'Invalid email or password' });
//         }
//       } catch (err) {
//         return done(err);
//       }
//     }
//   ));

//   passport.serializeUser((user, done) => {
//     done(null, user.id);  // Store user ID in session
//   });

//   passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await User.findById(id);
//       done(null, user);
//     } catch (err) {
//       done(err);
//     }
//   });
// };
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user.model'); // Adjust the path as needed

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' }, // Assuming email is used for login
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Invalid email or password' });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(new Error('User not found'), null);
      }
      done(null, user);
    } catch (err) {
      console.error('Error deserializing user:', err);
      done(err, null);
    }
  });
};
