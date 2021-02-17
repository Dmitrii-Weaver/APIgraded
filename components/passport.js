const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const users = require('../users');
const jwtSecretKey = {secret : process.env.SECRET};


passport.use(new BasicStrategy(
    function (username, password, done) {
        const user = users.getUserByName(username)
        if (user == undefined) {
            console.log("user not found")
            return done(null, false, { message: "user not found" });
        }
        if (bcrypt.compareSync(password, user.password) == false) {
            console.log("wrong password")
            return done(null, false, { message: "wrong password" });
        }
        return done(null, user)

    }
))

let options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = jwtSecretKey.secret;

passport.use(new JwtStrategy(options, function(jwt_payload, done) {

  const now = Date.now() / 1000;
  if(jwt_payload.exp > now) {
    done(null, jwt_payload.user);
  }
  else {
    done(null, false);
  }
}));


module.exports = passport;