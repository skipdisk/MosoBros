const passport = require('passport');

module.exports = app => {
	app.get(
		'/auth/google',
		passport.authenticate('google', {
			//types of information that is requested from google
			scope: ['profile', 'email']
		})
	);
	//handles getting the profile of user when sent back from google
	app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
		res.redirect('/');
	});
};
