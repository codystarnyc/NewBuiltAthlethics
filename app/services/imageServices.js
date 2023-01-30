require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const morgan = require("morgan");
const path = require('path');
const cors = require('cors');

const aws = require('aws-sdk');
aws.config.setPromisesDependency();
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET,
    accessKeyId: process.env.AWS_KEY,
    region: process.env.REGION
});

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }).then(() => {
    console.log("connected to database successfully");
});
//app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));
app.use(express.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV == 'developement') {
    app.use(morgan('dev'));
}
app.use(cors())
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
//for admin panel api
app.use('/api/authAdmin', require('./app/admin/authAdmin'));
app.use('/api/admin/user', require('./app/admin/user'));
app.use('/api/admin/product', require('./app/admin/product'));
app.use('/api/admin/category', require('./app/admin/category'));
app.use('/api/admin/suchazproduct', require('./app/admin/Suchazproduct'));


//for app user
app.use('/api/user', require('./app/user'));
app.use('/api/auth', require('./app/auth'));


//master collections
app.use('/api/agegroup', require('./app/age_group'));
app.use('/api/personality', require('./app/personalities'));
app.use('/api/relationship', require('./app/relationships'));
app.use('/api/hobby', require('./app/hobbies'));
app.use('/api/occasion', require('./app/occasions'));
app.use('/api/profession', require('./app/professions'));
app.use('/api/country', require('./app/country'));


//app.use("/api/v1/tours",require('./tourRouters'));
app.get("*", (req, res, next) => {
    res.status(400).json({
        message: 'Route not found'
    })
});

const port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('app is listing on port ' + port);
});