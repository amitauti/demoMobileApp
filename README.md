First, we create a DynamoDB table using the DynamoDB console. Then we create a Lambda function using the AWS Lambda console. Next, we create an HTTP API using the API Gateway console. Lastly, we test our API.

When we invoke our HTTP API, API Gateway routes the request to our Lambda function. The Lambda function interacts with DynamoDB and returns a response to API Gateway. API Gateway then returns a response to us.

Step 1: Create a DynamoDB table
We use a DynamoDB table to store data for our API.

Each item has a unique ID, which we use as the partition key for the table.

To create a DynamoDB table

Open the DynamoDB console at https://console.aws.amazon.com/dynamodb/.
Choose Create table.
For Table name, enter http-crud-tutorial-items.
For Primary key, enter nightId.
Choose Create.

Step 2: Create a Lambda function
We create a Lambda function for the backend of our API. This Lambda function creates, reads, updates, and deletes items from DynamoDB. The function uses events from API Gateway to determine how to interact with DynamoDB. For simplicity, this tutorial uses a single Lambda function. As a best practice, we should create separate functions for each route.

To create a Lambda function

Sign in to the Lambda console at https://console.aws.amazon.com/lambda.
Choose Create function.
For Function name, enter http-crud-tutorial-function.
Under Permissions choose Change default execution role.
Select Create a new role from AWS policy templates.
For Role name, enter http-crud-tutorial-role.
For Policy templates, choose Simple microservice permissions. This policy grants the Lambda function permission to interact with DynamoDB.Note

Choose Create function.
Open index.js in the console’s code editor, and replace its contents with the following code. Choose Deploy to update function.
Step 3: Create an HTTP API
The HTTP API provides an HTTP endpoint for our Lambda function. In this step, we create an empty API. In the following steps, we configure routes and integrations to connect our API and Lambda function.

To create an HTTP API

Sign in to the API Gateway console at https://console.aws.amazon.com/apigateway.
Choose Create API, and then for HTTP API, choose Build.
For API name, enter http-crud-tutorial-api.
Choose Next.
For Configure routes, choose Next to skip route creation. We create routes later.
Review the stage that API Gateway creates for us, and then choose Next.
Choose Create.
Step 4: Create routes
Routes are a way to send incoming API requests to backend resources. Routes consist of two parts: an HTTP method and a resource path, for example, GET /items. For this example API, we create four routes:

GET /items/{id}
GET /items
PUT /items
DELETE /items/{id}
To create routes

Sign in to the API Gateway console at https://console.aws.amazon.com/apigateway.
Choose our API.
Choose Routes.
Choose Create.
For Method, choose GET.
For the path, enter /items/{id}. The {id} at the end of the path is a path parameter that API Gateway retrieves from the request path when a client makes a request.
Choose Create.
Repeat steps 4-7 for GET /items, DELETE /items/{id}, and PUT /items.

Step 5: Create an integration
We create an integration to connect a route to backend resources. For this example API, we create one Lambda integration that we use for all routes.

To create an integration

Sign in to the API Gateway console at https://console.aws.amazon.com/apigateway.
Choose our API.
Choose Integrations.
Choose Manage integrations and then choose Create.
Skip Attach this integration to a route. We complete that in a later step.
For Integration type, choose Lambda function.
For Lambda function, enter http-crud-tutorial-function.
Choose Create.
Step 6: Attach our integration to routes
For this example API, we use the same Lambda integration for all routes. After we attach the integration to all of the API’s routes, our Lambda function is invoked when a client calls any of our routes.

To attach integrations to routes

Sign in to the API Gateway console at https://console.aws.amazon.com/apigateway.
Choose our API.
Choose Integrations.
Choose a route.
Under Choose an existing integration, choose http-crud-tutorial-function.
Choose Attach integration.
Repeat steps 4-6 for all routes.
All routes show that an AWS Lambda integration is attached.


        The console shows AWS Lambda on all routes to indicate that your integration is attached.
      
Now that we have an HTTP API with routes and integrations, we can test our API.
