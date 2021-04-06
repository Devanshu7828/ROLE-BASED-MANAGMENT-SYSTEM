const passport = require("passport");
const RememberMeStrategy = require("passport-remember-me");


passport.use(new RememberMeStrategy(
    function (token, done) {
        Token.consume(token, function (err, user) {
            if (err) return done(err);
            if (!user) return done(null, false);
            return done(null, user);
        });
    },
    function (user, done) {
        const token = utils.generateToken(64);
        Token.save(token, { userId: user.id }, function (err) {
            if (err) return done(err);
            return done(null,token);
        })
    }
))