 const aws = require('aws-sdk');
 const s3 = new aws.S3();


async function moveData(images){
        try{
         
       
        var copyParam = {
                                Bucket: process.env.SUCHAZ_CUSTOM,
                                CopySource: process.env.SUCHAZ_TEMP+'/'+images.split('/').pop(), 
                                Key: images.split('/').pop(),
                                ACL: 'public-read',
                            };    
                             await  s3.copyObject(copyParam,async function(err, data) {
                                if (err){
                                    //console.log(err, err.stack);
                                    return "";
                                }else{
                                      
                                    // var params = {Bucket: process.env.SUCHAZ_CUSTOM, Key: images.split('/').pop()};
                                    // s3.getSignedUrl('putObject', params, function (err, url) {
                                    //     console.log('The URL is', url);
                                    // });

                                    var deleteParam = {
                                        Bucket: process.env.SUCHAZ_TEMP,
                                        Key: images.split('/').pop()
                                    };    

                                    await s3.deleteObject(deleteParam, function(err, data) {
                                        if (err){
                                            return images.replace("/Temp/", "/customization/");
                                        }else{
                                           return images.replace("/Temp/", "/customization/");
                                        } 
                                    });
                                    
                                } 
                            });
      } catch (error) {
            return "";
         //console.log(error.message);
      }
}
exports.moveFiles   =   function (ImageArray){
            let newImageArray = [];
            ImageArray.forEach(element => {
                
                 let url =  moveData(element)
                 console.log(url);
                 
                 newImageArray.push(url);   
            });
            return newImageArray;          
} 
 exports.singleDelete = function(Bucket,Image) {
    if(Image.trim()==""){
        return false;
    }
                    var deleteParam = {
                        Bucket: process.env.CATEGORY_BUCKET,
                        Key: Image.split('/').pop()
                    };    
                    s3.deleteObject(deleteParam, function(err, data) {
                        if (err){
                            return false;
                        }else{
                            return true;
                        } 
                    });
 }
 
exports.multiDelete = function(Bucket,Image,key){
                if(Image.trim()==""){
                    return false;
                }

                let keyArray=[];
                let delete_image = JSON.parse(Image);

                delete_image.map(v=>{
                    keyArray.push({Key:key.concat(v.split('/').pop())});
                });
                console.log("Delete Array",keyArray);
                
                var deleteParam = {
                    Bucket: Bucket,
                    Delete: {
                        Objects: keyArray
                    }
                };    
                s3.deleteObjects(deleteParam, function(err, data) {
                     if (err){
                            return false;
                        }else{
                            return true;
                        } 
                });
 }
 