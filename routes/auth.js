// const passport = require('passport');
// const express = require('express');
// const {
//     googleAuth,
//     googleAuthCallback
// } = require('../controllers/auth-controller')
// const router = express.Router();



// module.exports = app => {
//     router.route('/auth/google')
//         .get(googleAuth)
//     router.route('/auth/google/callback')
//         .get(googleAuthCallback)
// };


const passport = require('passport');

module.exports = app => {
    app.get('/auth/google',
        passport.authenticate('google', {
            //types of information that is requested from google
            scope: ['profile', 'email']
        })
    );
    //handles getting the profile of user when sent back from google
    app.get('/auth/google/callback',
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/surveys');
        }
    );
};