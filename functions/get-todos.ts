import { APIGatewayProxyHandler } from "aws-lambda/trigger/api-gateway-proxy";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  ScanCommand,
  GetCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const dynamodbEndpoint = process.env.LOCALSTACK_HOSTNAME;

const client = new DynamoDBClient({
  endpoint: `http://${dynamodbEndpoint}:4566`,
});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const id = event.pathParameters?.id;

  if (id) {
    const command = new GetCommand({
      TableName: process.env.TODOS_TABLE!,
      Key: {
        id,
      },
    });

    const result = await docClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: result.Item,
      }),
    };
  }

  const lastEvaluatedKeyParam = event.queryStringParameters?.lastEvaluatedKey;
  const limit = event.queryStringParameters?.limit ?? 10;

  const command = new ScanCommand({
    TableName: process.env.TODOS_TABLE!,
    Limit: Number(limit),
    ExclusiveStartKey: lastEvaluatedKeyParam
      ? { id: lastEvaluatedKeyParam }
      : undefined,
  });

  try {
    const result = await docClient.send(command);
    const lastEvaluatedKey = result.LastEvaluatedKey?.id;
    const items = result.Items;

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: items,
        links: [
          {
            rel: "self",
            href: `/todos`,
          },
          lastEvaluatedKey && {
            rel: "next",
            href: `/todos?lastEvaluatedKey=${lastEvaluatedKey}&limit=${limit}`,
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
