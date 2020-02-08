const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const imageUpload = require('../services/imageUpload');

//pass in require login middleware
const requireLogin = require('../middlewares/requireLogin')


module.exports = app => {
    app.post('/api/stripe', requireLogin, async (req, res) => {
        const charge = await stripe.charges.create({
            amount: 500,
            currency: 'usd',
            description: 'credit purchase',
            source: req.body.id
        });
        req.user.credits += 5;
        const user = await req.user.save()
        res.send(user);
    })


    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/')
    });


    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

    app.post('/api/image-upload', imageUpload.single('file'), function (req, res, next) {
        console.log(req.file);
        console.log('test')
        if (!req.file) {
            res.status(500);
            return next(err);
        }
        res.json({ fileUrl: 'http://localhost:3000/images/' + req.file.filename });
    })


};