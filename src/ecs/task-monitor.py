import boto3


def handler(event, context):
	cluster = event.get('cluster', 'prod')
	region = event.get('region', 'eu-central-1')
	client = boto3.client('ecs', region_name=region)

	tasks = client.list_tasks(cluster=cluster)
	response = client.describe_tasks(cluster=cluster, tasks=tasks['taskArns'])
	tasks_data = []

	for task in response['tasks']:
		result_task = dict()
		result_task['actualState'] = task['lastStatus']
		result_task['desiredState'] = task['desiredStatus']

		task_definition = task['taskDefinitionArn'].split('task-definition/')[1]
		task_definition_response = client.describe_task_definition(taskDefinition=task_definition)

		for containerDefinition in task_definition_response['taskDefinition']['containerDefinitions']:
			tag = containerDefinition['image'].split(':')[1]
			result_task['dockerTag'] = tag

		tasks_data.append(result_task)

	return {
		"BACKEND_SERVICE_STATUS": {
			"title": "Backend Service",
			"tasks": tasks_data
		}
	}
