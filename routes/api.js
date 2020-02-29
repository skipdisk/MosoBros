const keys = require('../config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const imageUpload = require('../services/imageUpload')
const express = require('express')
const path = require('path')

const {
    spawn
} = require('child_process')
var fs = require('fs')

//pass in require login middleware
const requireLogin = require('../middlewares/requireLogin')

module.exports = app => {
    app.post('/api/stripe', requireLogin, async (req, res) => {
        const charge = await stripe.charges.create({
            amount: 500,
            currency: 'usd',
            description: 'credit purchase',
            source: req.body.id
        })
        req.user.credits += 5
        const user = await req.user.save()
        res.send(user)
    })

    app.get('/api/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })

    app.get('/api/current_user', (req, res) => {
        res.send(req.user)
    })

    app.get('/api/images', (req, res) => {
        res.send(req.user)
    })

    app.post('/api/image-upload', imageUpload.single('file'), async function (
        req,
        res,
        next
    ) {
        req.user.images.push(
            'http://localhost:5000/services/uploads/' + req.file.filename
        )
        const user = await req.user.save()
        res.send(user.images)

        //big dick energy
        if (!req.file) {
            res.status(500)
            return next(err)
        }

        // var dataToSend;
        // // spawn new child process to call the python script
        // const python = spawn('python', ['/Users/thien/Desktop/MosBros/routes/image.py', req.file.path]);

        // // collect data from script
        // python.stdout.on('data', function (data) {
        //     console.log(data.toString());
        //     dataToSend = data.toString();
        // });

        // python.on('close', (code) => {
        //     console.log(`child process close all stdio with code ${code}`);
        //     // send data to browser
        //     res.send(dataToSend)
        // });
    })

    //links upload folder for api to be able to access it in localhost:5000/api/services/uploads/:imageName
    app.get('/', express.static(path.join(__dirname, '/api/services/uploads')))
}