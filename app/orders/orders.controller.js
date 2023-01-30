const Validator = require('validatorjs');
 
const { fail, success, httpCode } = require('../helper');
const { moveFiles } = require('../imageHelper');

const multer = require('multer');

const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const s3 = new aws.S3();
var mongoose = require('mongoose');
const url = require('url');
const path = require('path');
const sharp = require('sharp');

 

const fileFilter = (req, file, cb) => { 
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(new Error("File format should be PNG,JPG,JPEG"), false); // if validation failed then generate error
    } 
};

const storage = multerS3({
    s3: s3,
    bucket: process.env.SUCHAZ_TEMP,
    acl: 'public-read',
    key: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage, fileFilter: fileFilter }).array('images');
exports.uploadExerciseVideo = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            let data = req.body;
            // let rules = {
            //     images: 'required',
            // };
            // let validation = new Validator(data, rules);
            // if (validation.fails()) {
            //     return fail(res, validation.errors.all(), httpCode.BAD_REQUEST);
            // }

            if (err) return fail(res, 'Invaid file type', httpCode.BAD_REQUEST);
            
            

            let images = [];
            if (req.files && req.files.length) {
                
                images = req.files.map(file => 'excercise/'+file.key);
            }else{
                    return fail(res, "Image not uploaded");
            }
            images = images?images:"";
            return success(res, images, {image:images[0], message: 'Added successfully' });
        });
    } catch (error) {
        return fail(res, error.message);
    }
}
exports.uploadTempImage = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            let data = req.body;
            // let rules = {
            //     images: 'required',
            // };
            // let validation = new Validator(data, rules);
            // if (validation.fails()) {
            //     return fail(res, validation.errors.all(), httpCode.BAD_REQUEST);
            // }
            const semiTransparentRedPng = await sharp({
                create: {
                  width: 48,
                  height: 48,
                  channels: 4,
                  background: { r: 255, g: 0, b: 0, alpha: 0.5 }
                }
              })
                .png()
                .toBuffer();
              
            if (err) return fail(res, 'Invaid file type', httpCode.BAD_REQUEST);
            
            

            let images = [];
            if (req.files && req.files.length) {
                
                images = req.files.map(file => 'food/'+file.key);
            }else{
                    return fail(res, "Image not uploaded");
            }
            images = images?images:"";
            return success(res, images, {image:images[0], message: 'Added successfully' });
        });
    } catch (error) {
        return fail(res, error.message);
    }
}
