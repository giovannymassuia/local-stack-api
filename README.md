# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

-   `npm run build` compile typescript to js
-   `npm run watch` watch for changes and compile
-   `npm run test` perform the jest unit tests
-   `cdk deploy` deploy this stack to your default AWS account/region
-   `cdk diff` compare deployed stack with current state
-   `cdk synth` emits the synthesized CloudFormation template

## Running locally

```bash
➜  localstack start
➜  cdklocal bootstrap
➜  cdklocal deploy
➜  npx jest
```

## Project setup

Init project

```bash
➜  npx cdk init app --language typescript
➜  cdklocal bootstrap
➜  cdklocal deploy
```

Dependencies

```bash
➜  npm i aws-lambda
➜  npm i @aws-sdk/client-cloudformation
➜  npm i -D @types/aws-lambda
```

Logs

```bash
➜  aws logs tail /aws/lambda/CreateTodoLambda --endpoint-url http://127.0.0.1:4566
➜  aws logs tail /aws/lambda/GetTodosLambda --endpoint-url http://127.0.0.1:4566
```

## Refs

-   https://docs.localstack.cloud/overview/
    -   https://docs.localstack.cloud/getting-started/installation/
    -   https://docs.localstack.cloud/user-guide/integrations/aws-cli/#localstack-aws-cli-awslocal
    -   https://docs.localstack.cloud/user-guide/integrations/aws-cdk/
