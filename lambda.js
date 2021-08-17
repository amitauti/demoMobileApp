        const AWS = require("aws-sdk");

        const dynamo = new AWS.DynamoDB.DocumentClient();

        exports.handler = async(event, context) => {
          let body;
          let statusCode = 200;
          const headers = {
            "Content-Type": "application/json"
          };
          console.log('Printing the event', event);
          var promises = [];

          try {
            switch (event.routeKey) {
              case "DELETE /items/{id}":
                let userId = event.pathParameters.id;
                console.log('###', userId);
                let result = await scanCrudTable(userId);
                console.log('####', result);

                if (result.Count > 0) {

                  result.Items.forEach((item) => {

                    console.log('Inside loop', item.nightId);

                    promises.push(deleteRecord(item.nightId));

                  });
                  body = `Deleted item ${event.pathParameters.id}`;

                }else {
                  console.log("No record exists for ", userId);
                  body = `No Record Found for given userId ${event.pathParameters.id}`;
                }
                

                await Promise.all(promises);

                // body = `Deleted item ${event.pathParameters.id}`;
                break;

              case "GET /items/{id}":
                let userId1 = event.pathParameters.id;
                var params = {
                  TableName: "http-crud-tutorial-items",
                  // ProjectionExpression: "nightId, userId","startTimeMilli", "endTimeMilli", "sleepQuality",
                  FilterExpression: "#userId1 = :userId",
                  ExpressionAttributeNames: {
                    "#userId1": "userId"
                  },
                  ExpressionAttributeValues: {
                    ":userId": userId1
                  }
                }
                console.log(params)
                body = await dynamo
                  .scan(params)
                  .promise();
                break;
              case "GET /items":
                body = await dynamo.scan({ TableName: "http-crud-tutorial-items" }).promise();
                break;
              case "POST /items":
                let requestJSON = JSON.parse(event.body);
                await dynamo
                  .put({
                    TableName: "http-crud-tutorial-items",
                    Item: {
                      nightId: event.requestContext.requestId,
                      userId: requestJSON.userId,
                      startTimeMilli: requestJSON.startTimeMilli,
                      endTimeMilli: requestJSON.endTimeMilli,
                      sleepQuality: requestJSON.sleepQuality
                    }
                  })
                  .promise();
                body = `Put item ${requestJSON.userId}`;
                break;
              default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
            }
          }
          catch (err) {
            statusCode = 400;
            body = err.message;
            console.error(new Error('Whoops, something bad happened'));
          }
          finally {
            body = JSON.stringify(body);
          }

          return {
            statusCode,
            body,
            headers
          };
        };

        async function scanCrudTable(userId) {
          console.log('printing the incoming', userId);
          var params = {
            TableName: "http-crud-tutorial-items",
            ProjectionExpression: "nightId, userId",
            FilterExpression: "#userId = :userId",
            ExpressionAttributeNames: {
              "#userId": "userId"
            },
            ExpressionAttributeValues: {
              ":userId": userId
            }
          }
          return dynamo.scan(params).promise();

        }


        async function deleteRecord(nightId) {

          return dynamo.delete({
            TableName: "http-crud-tutorial-items",
            Key: {
              nightId: nightId
            }
          }).promise();
        }
        
