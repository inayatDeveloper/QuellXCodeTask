const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    path = require('path'),
    User = require('./models/userModel'),
    routes = require('./routes/route.js'),
    app = express(),
    port = process.env.PORT || 3000;



require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

mongoose.connect('mongodb://localhost:27017/QuellxCodeTask', {useNewUrlParser: true}).then(() => {
    console.log('Connected to the Database successfully')
});

app.use(bodyParser.urlencoded({extended: true}));

app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
        try {
            const accessToken = req.headers["x-access-token"];
            const {userId, exp} = await jwt.verify(accessToken, process.env.JWT_SECRET);
            // If token has expired
            if (exp < Date.now().valueOf() / 1000) {
                return res.status(401).json({
                    error: "JWT token has expired, please login to obtain a new one"
                });
            }
            res.locals.loggedInUser = await User.findById(userId);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

app.use('/', routes);

app.listen(port, () => {
    console.log('Server is listening on Port:', port)
})