# Serverless Task Manager

A simple task management web application built using React and AWS serverless services.

I built this project to understand how a frontend application can communicate with AWS services and store data without using a traditional server.

## What can you do?

- Add a new task
- Edit existing tasks
- Mark tasks as completed
- Delete tasks
- Set task priority
- Add due dates
- Search and filter tasks

## Demo

[Watch the Serverless Task Manager demo](demo/Serverless_taskManager.mp4)

## How it works

The application follows this flow:

React → API Gateway → Lambda → DynamoDB

The React frontend sends requests to Amazon API Gateway. API Gateway connects the requests to AWS Lambda functions, which handle the task operations. The task data is stored in an Amazon DynamoDB table.

## AWS Services Used

- AWS Lambda – Handles the backend operations
- Amazon API Gateway – Connects the frontend with Lambda
- Amazon DynamoDB – Stores the task data
- AWS IAM – Controls permissions for the Lambda functions

## API Routes

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/tasks` | Add a new task |
| GET | `/tasks` | Get all tasks |
| PUT | `/tasks/{taskId}` | Update a task |
| DELETE | `/tasks/{taskId}` | Delete a task |

## Database

The project uses a DynamoDB table called `Tasks`.

Each task contains information such as:

- Task ID
- Task title
- Priority
- Due date
- Completion status
## What I Learned

Building this project helped me understand how different AWS services work together in a real application.

- Creating and testing AWS Lambda functions
- Using API Gateway to create REST API routes
- Storing and retrieving data from DynamoDB
- Setting IAM permissions for Lambda
- Connecting a React frontend with AWS APIs
- Handling CORS between the frontend and API
- Testing API requests and debugging errors
- Understanding how a serverless application works from frontend to database

## Screenshots

### Task Manager

![Task Manager](screenshots/final-ui.png)

### DynamoDB Table

![DynamoDB Table](screenshots/dynamodb-table.png)

### Stored Tasks

![DynamoDB Items](screenshots/dynamodb-items.png)

### API Gateway Routes

![API Gateway Routes](screenshots/api-gateway-routes.png)

## Running the Frontend

Clone the repository and open the frontend folder:

```bash
cd Frontend
npm install
npm run dev