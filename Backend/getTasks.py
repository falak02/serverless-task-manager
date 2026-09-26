import json
import boto3

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table("Tasks")


def lambda_handler(event, context):

    try:

        response = table.scan()

        tasks = response.get("Items", [])

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(tasks, default=str)
        }

    except Exception as e:

        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": str(e)
            })
        }