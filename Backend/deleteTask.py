import json
import boto3

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table("Tasks")


def lambda_handler(event, context):

    try:

        task_id = event.get("pathParameters", {}).get("taskId")

        if not task_id:

            return {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "message": "Task ID is required"
                })
            }

        table.delete_item(
            Key={
                "taskId": task_id
            }
        )

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Task deleted successfully"
            })
        }

    except Exception as e:

        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": str(e)
            })
        }