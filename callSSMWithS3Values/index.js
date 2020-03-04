var AWS = require('aws-sdk');
const ssm = new AWS.SSM();
const s3 = new AWS.S3();
const cloudwatchlogs = new AWS.CloudWatchLogs();

exports.handler = (event, context, callback) => {
  var logGroupName = "test";
  var logStreamName = logGroupName + "/" + new Date().getTime()

  var params = {
    logGroupName: logGroupName,
    logStreamName: logStreamName
  };
  cloudwatchlogs.createLogStream(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
  let s3Params = {
    Bucket: event.bucketName,
    Key: event.keyName
  };
 
  s3.getObject(s3Params, function(err, data) {
    if (err) {
      createLogs(logGroupName, logStreamName, err);
      createLogs(logGroupName, logStreamName, err.stack);
      console.log(err, err.stack);
    }
    else {
      let ssmInputs = data.Body.toString();
      //console.log('ssmInputs', ssmInputs);
      let ssmInputsJSON = JSON.parse(ssmInputs);
      createLogs(logGroupName, logStreamName, ssmInputs);

      var params = {
        DocumentName: ssmInputsJSON.documentName,
        InstanceIds: [ssmInputsJSON.instanceId],
        Parameters: {
          'commands': [ssmInputsJSON.commands]
        },
        CloudWatchOutputConfig: {
          CloudWatchLogGroupName: ssmInputsJSON.cloudWatchLogGroupName,
          CloudWatchOutputEnabled: true
        }
      };

      ssm.sendCommand(params, function(err, data) {
        if (err) console.log(err, err.stack);
        //else console.log("data", data);
        callback(null, { "ssmInputsJSON": ssmInputsJSON });
      });
    }
  });
    }
  });
};

function createLogs(logGroupName, logStreamName, logMessage) {
  
      var cloudWatchParams = {
        logEvents: [{
            message: logMessage,
            timestamp: new Date().getTime()
          }
        ],
        logGroupName: logGroupName,
        logStreamName: logStreamName
      };

      cloudwatchlogs.putLogEvents(cloudWatchParams, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
      });
    
}