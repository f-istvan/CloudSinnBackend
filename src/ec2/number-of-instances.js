let AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
var ec2 = new AWS.EC2('2016-11-15');

module.exports.handler = (event, context, callback) => {
  let stackName = event['stackName'] || 'prod';

  var params = {
    Filters: [{
      Name: "tag:StackName",
      Values: [ stackName ]
    }]
  };

  ec2.describeInstances(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      callback(err);
    } else {
      let result = {
        "EC2_INSTANCES": {
          "title": "Running EC2 Instances",
          "dataPoints": [{
            "timestamp": new Date(),
            "number": data['Reservations'].length
          }]
        }
      }
      callback(null, result);
    }
 });
};
