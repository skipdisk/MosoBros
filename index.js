const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');



const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/error')


require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();

// use it before all route definitions
app.use(cors({ origin: '*' }));

//body parser
app.use(bodyParser.json());

//uses logging middleware for development mode
if (process.env.NODE_ENV === 'development') {
    //app.use(logger);
    app.use(morgan('dev'))
}

//stores cookie for future login
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, //30 days, 24 hrs, 60 mins, 60 secs, 1000 milli secs
        keys: [keys.cookieKey]
    })
)
app.use(express.json());

//adds static route for image upload
app.use(express.static(__dirname));

app.use(passport.initialize());
app.use(passport.session());



//mounts router
//calls index routes and passes app object in
require('./routes/index')(app);

//error handler
app.use(errorHandler)


//creates a dynamic port based on heroku's runtime environment or 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT);