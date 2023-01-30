require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const morgan = require("morgan");
const path = require('path');
const cors = require('cors');
const helmet = require("helmet");
var rfs = require('rotating-file-stream'); 
const aws = require('aws-sdk');
aws.config.setPromisesDependency();
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET,
    accessKeyId: process.env.AWS_KEY,
    region: process.env.REGION
});

// mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false,useUnifiedTopology:true }).then(() => {
//     console.log("connected to database successfully");
// });
//app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));
app.use(express.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV == 'developement') {
    // create a rotating write stream
    var accessLogStream = rfs.createStream('access.log', {
        interval: '5M', // rotate daily
        path: path.join(__dirname, 'log'),
        size: "1K", // rotate every 10 MegaBytes written
        interval: "1d"  // rotate daily
        //compress: "gzip" // compress rotated files
    })
    app.use(morgan('combined', { stream: accessLogStream }))
}   
 
 
//app.use(helmet());

app.use(cors())
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
 console.log("calling");
 
// ["admin", "VENDOR",  "STORE_MANAGER", "GIFTER", "REVIWER"]


//for admin panel api
//
//app.use('/apiv2/otp', require('./app/otp')) 



app.use('/apiv2/order', require('./app/orders'));


//app.use("/apiv2/v1/tours",require('./tourRouters'));
app.get("*", (req, res, next) => {
    res.status(400).json({
        message: 'Route not found'
    })
});

const port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('app is listing on port ' + port);
});