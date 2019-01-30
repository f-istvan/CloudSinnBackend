let AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
let dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

let getLastWeek = () => {
  let today = new Date();
  let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  return lastWeek;
};

let getTableNameByStackName = (stackName) => {
	var cloudFormation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

	let params = {
	   "StackName": "prod"
	};
	cloudFormation.describeStacks(params, function(err, data) {
	  if (err) {
	    console.log(err, err.stack);
	    callback(err);
	  } else {
	    return data['Stacks'][0]['Parameters']
	        .filter(elem => elem.ParameterKey == 'DbName')
	        .map(elem => elem.ParameterValue)[0]
	  }
	});
};

module.exports.handler = (event, context, callback) => {
	let stackName = event['stackName'] || 'prod';
    let tableName = getTableNameByStackName(stackName);
	let lastWeek = getLastWeek();

	let  params = {
      BackupType: 'ALL',
      Limit: 30,
      TableName: tableName,
      TimeRangeLowerBound: lastWeek
    };

	dynamodb.listBackups(params, function(err, response) {
	  if (err) {
	    console.log(err, err.stack);
	    callback(err);
	  } else {
	    let backupSummaries = response['BackupSummaries'];
	    backupSummaries.sort((bc2, bc1) => {
		    return new Date(bc1['BackupCreationDateTime']) - new Date(bc2['BackupCreationDateTime']);
		  });
		let size = backupSummaries.length < 5 ? backupSummaries.length : 5
		let backups = backupSummaries
		  .slice(0, size)
		  .map(backup => {
		    return {
		        "tableName": backup.TableName,
		        "backupCreationDateTime": backup.BackupCreationDateTime,
		        "backupSizeBytes": backup.BackupSizeBytes
		    }
		  })
		let result = {
		    "BACKUP_STATUS": {
                "title": "Backup Status",
                "backups": backups
		    }
		};
	    callback(null, result);
	  }
	});
};
