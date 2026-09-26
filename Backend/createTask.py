import json
import boto3
import uuid

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table("Tasks")


def lambda_handler(event, context):

    try:

        body = json.loads(event.get("body", "{}"))

        title = body.get("title", "").strip()
        priority = body.get("priority", "Medium")
        due_date = body.get("dueDate", "")

        if not title:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "message": "Task title is required"
                })
            }

        task_id = str(uuid.uuid4())

        item = {
            "taskId": task_id,
            "title": title,
            "priority": priority,
            "dueDate": due_date,
            "completed": False
        }

        table.put_item(Item=item)

        return {
            "statusCode": 201,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(item)
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