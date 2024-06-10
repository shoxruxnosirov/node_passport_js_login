const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');

const app = express();

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));
// app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));        // passport doc da bor ekan


// Express session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    // store: new MySQLStore(require('./services/knexConnectingDataBD').connection)

}));

// Connect flash
app.use(flash());

// passport config
require('./config/passport')(passport); 

// Passport middleware
app.use(passport.authenticate('session'));
// app.use(passport.initialize());
// app.use(passport.session());


// Global vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on PORT ${PORT}`));
