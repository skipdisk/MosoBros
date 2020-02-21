const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const imageUpload = require('../services/imageUpload');

const { spawn } = require('child_process');
var fs = require('fs');




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


        var dataToSend;
        // spawn new child process to call the python script
        const python = spawn('python', ['/Users/thien/Desktop/MosBros/MosBros/routes/image.py', req.file.path]);
        // collect data from script
        python.stdout.on('data', function (data) {
            console.log(data.toString());
            dataToSend = data.toString();
        });

        if (!req.file) {
            res.status(500);
            return next(err);
        }

        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            // send data to browser
            res.send(dataToSend)
        });
        // res.json({ fileUrl: 'http://localhost:3000/images/' + req.file.filename });
    })


};