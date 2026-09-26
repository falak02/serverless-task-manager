import json
import boto3

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table("Tasks")


def lambda_handler(event, context):

    try:

        task_id = event.get(
            "pathParameters", {}
        ).get("taskId")

        body = json.loads(
            event.get("body", "{}")
        )

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

        title = body.get("title")
        priority = body.get("priority", "Medium")
        due_date = body.get("dueDate", "")
        completed = body.get("completed")

        update_expression = "SET #title = :title, priority = :priority, dueDate = :dueDate"

        expression_names = {
            "#title": "title"
        }

        expression_values = {
            ":title": title,
            ":priority": priority,
            ":dueDate": due_date
        }

        if completed is not None:

            update_expression += ", completed = :completed"

            expression_values[":completed"] = completed

        table.update_item(
            Key={
                "taskId": task_id
            },
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_names,
            ExpressionAttributeValues=expression_values
        )

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Task updated successfully"
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