import { APIGatewayProxyHandler } from "aws-lambda/trigger/api-gateway-proxy";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { randomUUID } from "crypto";

type InputRequest = {
  name: string;
};

const dynamodbEndpoint = process.env.LOCALSTACK_HOSTNAME;

const client = new DynamoDBClient({
  endpoint: `http://${dynamodbEndpoint}:4566`,
});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const { name } = JSON.parse(event.body!) as InputRequest;

  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          message: "Missing name",
        },
      }),
    };
  }

  const id = randomUUID();

  const command = new PutCommand({
    TableName: process.env.TODOS_TABLE!,
    Item: {
      id,
      name,
    },
  });

  try {
    await docClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          id,
          name,
        },
        links: [
          {
            rel: "self",
            href: `${event.headers.origin}/todos/${id}`,
          },
        ],
      }),
    };
  } catch (error: any) {
    console.error(error);
    console.error(error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          message: error.message,
        },
      }),
    };
  }
};
