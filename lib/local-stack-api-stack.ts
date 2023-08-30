import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class LocalStackApiStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const createTodoLambda = this.createLambdaFunction('create-todo');
        const getTodosLambda = this.createLambdaFunction('get-todos');

        const apiGtw = this.createApiGateway('local');

        const rootApi = apiGtw.root.addResource('todos');
        rootApi.addMethod('POST', new LambdaIntegration(createTodoLambda));
        rootApi.addMethod('GET', new LambdaIntegration(getTodosLambda));

        const withIdResource = rootApi.addResource('{id}');
        withIdResource.addMethod('GET', new LambdaIntegration(getTodosLambda));

        const todosTable = this.createTodosTable('todos-table', [createTodoLambda, getTodosLambda]);
        createTodoLambda.addEnvironment('TODOS_TABLE', todosTable.tableName);
        getTodosLambda.addEnvironment('TODOS_TABLE', todosTable.tableName);

        // Outputs
        new cdk.CfnOutput(this, 'ApiUrl', {
            value: apiGtw.url
        });
    }

    private createLambdaFunction(functionName: string) {
        return new NodejsFunction(this, functionName, {
            entry: `functions/${functionName}.ts`,
            handler: 'handler',
            functionName
        });
    }

    private createApiGateway(env: 'local' | 'dev' | 'prod') {
        return new RestApi(this, 'ApiGateway', {
            restApiName: 'LocalStackApi',
            deployOptions: {
                stageName: env
            }
        });
    }

    private createTodosTable(tableName: string, lambdasToGrantPermissions: NodejsFunction[]) {
        const table = new dynamodb.Table(this, tableName, {
            tableName,
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING
            }
        });

        lambdasToGrantPermissions.forEach((lambda) => table.grantReadWriteData(lambda));

        return table;
    }
}
