import boto3
import json

lambda_client = boto3.client('lambda', region_name='eu-west-1')


def handler(event, context):
    stack = event.get('stack', 'prod')

    task_monitor_invoke_response = lambda_client.invoke(
        FunctionName="CloudSinnBackend-dev-CloudSinnTaskMonitor",
        InvocationType='RequestResponse')

    backup_invoke_response = lambda_client.invoke(
        FunctionName="CloudSinnBackend-dev-CloudSinnDatabaseBackup",
        InvocationType='RequestResponse')

    number_of_instances_invoke_response = lambda_client.invoke(
        FunctionName="CloudSinnBackend-dev-CloudSinnNumberOfInstances",
        InvocationType='RequestResponse')

    list_stack_status_invoke_response = lambda_client.invoke(
        FunctionName="CloudSinnBackend-dev-CloudSinnListStackStatus",
        InvocationType='RequestResponse')

    otta_developer_violation_invoke_response = lambda_client.invoke(
        FunctionName="CloudSinnBackend-dev-CloudSinnOttaDeveloperViolation",
        InvocationType='RequestResponse')

    task_monitor_invoke_response = json.loads(task_monitor_invoke_response['Payload'].read().decode())
    backup_invoke_response = json.loads(backup_invoke_response['Payload'].read().decode())
    number_of_instances_invoke_response = json.loads(number_of_instances_invoke_response['Payload'].read().decode())
    list_stack_status_invoke_response = json.loads(list_stack_status_invoke_response['Payload'].read().decode())
    otta_developer_violation_invoke_response = json.loads(otta_developer_violation_invoke_response['Payload'].read().decode())

    res = dict()
    res = {**res, **task_monitor_invoke_response}
    res = {**res, **backup_invoke_response}
    res = {**res, **number_of_instances_invoke_response}
    res = {**res, **list_stack_status_invoke_response}
    res = {**res, **otta_developer_violation_invoke_response}

    result = {
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": True
        },
        "statusCode": 200,
        "body": str(res)
    }

    return result
