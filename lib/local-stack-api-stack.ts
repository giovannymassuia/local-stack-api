import * as cdk from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class LocalStackApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const createTodoLambda = new NodejsFunction(this, "CreateTodoLambda", {
      entry: "functions/create-todo.ts",
      handler: "handler",
      functionName: "CreateTodoLambda",
    });

    const getTodosLambda = new NodejsFunction(this, "GetTodosLambda", {
      entry: "functions/get-todos.ts",
      handler: "handler",
      functionName: "GetTodosLambda",
    });

    const apiGtw = new RestApi(this, "ApiGateway", {
      restApiName: "LocalStackApi",
      deployOptions: {
        stageName: "local",
      },
    });

    const rootApi = apiGtw.root.addResource("todos");
    rootApi.addMethod("POST", new LambdaIntegration(createTodoLambda));
    rootApi.addMethod("GET", new LambdaIntegration(getTodosLambda));
    rootApi
      .addResource("{id}")
      .addMethod("GET", new LambdaIntegration(getTodosLambda));

    const todosTable = new dynamodb.Table(this, "TodosTable", {
      tableName: "TodosTable",
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
    });

    createTodoLambda.addEnvironment("TODOS_TABLE", todosTable.tableName);
    todosTable.grantReadWriteData(createTodoLambda);

    getTodosLambda.addEnvironment("TODOS_TABLE", todosTable.tableName);
    todosTable.grantReadWriteData(getTodosLambda);

    // Outputs
    new cdk.CfnOutput(this, "ApiUrl", {
      value: apiGtw.url,
    });
  }
}
