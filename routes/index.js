const apiRoutes = require('./api')
const authRoutes = require('./auth')

module.exports = app => {
    (authRoutes)(app),
        (apiRoutes)(app)
};