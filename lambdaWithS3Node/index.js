var AWS = require('aws-sdk');
var http = require('http');
var querystring = require('querystring');
var s3 = new AWS.S3();

exports.handler = (event, context, callback) => {  
   var bucketName = event.Records[0].s3.bucket.name;
   var keyName = event.Records[0].s3.object.key;
   readFile(bucketName, keyName, readFileContent, onError, callback, sendReq);
};

function readFile (bucketName, filename, onFileContent, onError, callback, sendReq) {
   var params = { Bucket: bucketName, Key: filename };
   s3.getObject(params, function (err, data) {
       if (!err) 
           onFileContent(filename, data.Body.toString(), callback, sendReq);
       else
           console.log(err);
   });
}

function readFileContent(filename, content, callback, sendReq) {
   let response = sendReq(content);
    callback(null, response);
}

function onError (err) {
   console.log('error: ' + err);
}            

function sendReq(content){
    return new Promise(function (resolve, reject) {
    var post_data = querystring.stringify(
      { jsonStr: JSON.stringify(content)}
  );
   var options = {
      host: process.env.talos_ui_hostname,
      port: process.env.talos_ui_port,
      path: '/JsonDemo/getjson',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
    };
    var post_req = http.request(options, function(res) {
        let returnData = '';

      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('######### Response: ' + chunk);
          returnData += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(returnData));
      });
      });
    console.log('post_req', post_req);
      // post the data
      post_req.write(post_data);
      post_req.end();
    });
}