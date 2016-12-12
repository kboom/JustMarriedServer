import passport from "passport";
import FacebookStrategy from "passport-facebook";
import Account from '../../models/account.model'
import bind from 'lodash/bind'

passport.use(new FacebookStrategy({
        clientID: '1806015219657884',
        clientSecret: '1e9d67e72737902cce62420e268d5a82',
        callbackURL: 'http://localhost:2701/api/auth/facebook/callback',
        profileFields: ["emails", "displayName", "name"]
    },
    function (accessToken, refreshToken, profile, done) {
        Account.findOne({'external.facebook.id': profile.id}, function (err, account) {
            if (err) {
                return done(err);
            } else {
                if (account) {
                    return done(null, account);
                } else {
                    account = new Account();
                    account.external.facebook.id = profile.id;
                    account.external.facebook.token = accessToken;
                    account.external.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
                    account.external.facebook.email = profile.emails[0].value;

                    account.save(function (err) {
                        if (err) throw err;
                        else return done(null, account)
                    })
                }
            }
        });
    }
));

exports.issueFacebookAuthenticationRequest = passport.authenticate('facebook', {
    session: false,
    scope: 'email'
});

exports.recoverFacebookAuthenticationResponse = passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
});
