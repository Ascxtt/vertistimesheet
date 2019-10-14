const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Load user Model
const User = require('../models/User');
const user = mongoose.model("users");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, function(
      email,
      password,
      done
    ) {
      // Match user
      user
        .findOne({
          email: email
        })
        .then(user => {
          if (!user) {
            return done(null, false, { message: "No user found" });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        });
    })
  );
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        user.findById(id, function (err, user) {
            done(err, user);
        });
    });
};
