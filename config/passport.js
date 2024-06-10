const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const workingDB = require('../services/workingDB');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(
            { usernameField: 'email' },
            (email, password, done) => {
                console.log('email: ', email);
                // Match User
                workingDB
                    .db('users')
                    .where({ email })
                    .then(users => {
                        console.log('users: ', users);
                        if (users.length === 0) {
                            return done(null, false, { message: 'That email is not registered' });
                        }

                        //Match password 
                        bcrypt.compare(password, users[0].password, (err, isMatch) => {
                            if (err) throw err;

                            if (isMatch) {
                                console.log('isMatch: users[0]: ', users[0]);
                                return done(null, users[0]);
                            } else {
                                return done(null, false, { message: 'Password incorrect' });
                            }
                        })
                    })
                    .catch(err => console.log(err));
            })
    );

    // passport.serializeUser((user, cb) => {
    //     process.nextTick(() => {
    //         console.log('serializeUser user:', user, ' serializeUser.');
    //         cb(null, { id: user.id, email: user.email });
    //     });
    // });
    // passport.deserializeUser((user, cb) => {
    //     process.nextTick(() => {
    //         console.log('deserializeUser user:', user, ' deserializeUser.');
    //         return cb(null, user);
    //     });
    // });

    passport.serializeUser((user, done) => {
        process.nextTick(() => {
            console.log('serializeUser user:', user, ' serializeUser.');
            done(null, user.id);
        })
    });
    passport.deserializeUser((id, done) => {
        process.nextTick(() => {
            console.log('deserializeUser id:', id, ' deserializeUser.');
            workingDB.getById('users', id)
                .then(users => done(null, users[0]))
                .catch(err => done(err));
        })
    });
}