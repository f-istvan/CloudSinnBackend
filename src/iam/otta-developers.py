import boto3


def handler(event, context):
    iam = boto3.client('iam')

    developers = [
        'artur.kulmukhametov',
        'bogdan.mustiata',
        'christoph.niederer',
        'franz.buchinger',
        'gardiner.vontrapp',
        'stefan.farkas',
    ]

    security_violation_users = []

    for developer in developers:
        user_groups = iam.list_groups_for_user(UserName=developer)
        otta_developer = next((True for group_name in user_groups['Groups'] if group_name['GroupName'] == 'OttaDevelopers'), False)
        if not otta_developer:
            security_violation_users.append(developer)

    result = {
        "NOT_INCLUDED_PEOPLE": {
            "title": "Not in OttaDeveloper Group",
            "usernames": security_violation_users
        }
    }

    return result
