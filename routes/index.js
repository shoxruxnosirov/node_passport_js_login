const express = require("express");

const router = express.Router();

// welcome page
router.get('/', (req, res) => res.render("welcome"));

// dashboard
router.get(
    '/dashboard',
    (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'please log in to view this resource');
        res.redirect('/users/login')
    },
    (req, res) => res.render("dashboard", {
        name: req.user.name
    })
);

module.exports = router;