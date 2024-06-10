const express = require("express");
const workingDB = require('../services/workingDB');
const bscrypt = require('bcryptjs');
const passport = require("passport");


// db
const db = require('../services/workingDB');


const router = express.Router();

// Login 
router.get('/login', (req, res) => res.render("login"));

// register
router.get('/register', (req, res) => res.render("register"));

// register handle
router.post('/register', async (req, res) => {

    const { name, email, password, password2 } = req.body;
    const errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ message: 'Please fill in all fields' });
    }

    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
        errors.push({ message: "Password should be at least 6 chatacters" });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        try {
            const data = await db.db('users')
                .where({ email });

            if (data.length) {
                errors.push({ message: "Email is already registered" });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                bscrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    return bscrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        // set password to hashed
                        db.insertData('users', {
                            name,
                            email,
                            password: hash
                        })
                            .then((data) => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.error(err));

                    });
                });
            }

        } catch (err) {
            console.log("err: ", err);
            res.send({ err });
        }
    }
});

router.post('/login', (req, res, next) => {
    console.log("post /users/login");
    passport.authenticate('local', {
        successFlash: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// router.post('/login', passport.authenticate('local', {
//     successFlash: '/dashboard',
//     failureRedirect: '/users/login',
//     failureFlash: true
// }));

module.exports = router;