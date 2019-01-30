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
	    let stackStatuses = data['Stacks'].map(stack => {
	      let lastUpdatedTime = stack['LastUpdatedTime'] || stack['CreationTime']
	      return {
	        "stackName": stack['StackName'],
	        "status": stack['StackStatus'],
	        "lastUpdatedTime": Math.round(new Date(lastUpdatedTime).getTime() / 1000),
	      }
	    });
	    let result = {
		    "STACK_STATUS": {
                "title": "Stack Status",
                "stacks": stackStatuses
		    }
		};
	    callback(null, result);
	  }
	});
};
