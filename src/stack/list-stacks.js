var AWS = require('aws-sdk');

module.exports.handler = (event, context, callback) => {
	let region = event['region'] || 'eu-central-1';
    AWS.config.update({region: region});
	var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

	let params = {};
	cloudformation.describeStacks(params, function(err, data) {
	  if (err) {
	    console.log(err, err.stack);
	    callback(err);
	  } else {
          let stackNames = data['Stacks'].map(stack => stack['StackName']);
          let result = {
            "statusCode": 200,
            "body": JSON.stringify(stackNames)
          }

	    callback(null, result);
	  }
	})
};
