import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';

export const getApiUrl = async () => {
    const client = new CloudFormationClient({
        endpoint: 'http://127.0.0.1:4566',
        region: 'us-east-1'
    });

    const { Stacks } = await client.send(
        new DescribeStacksCommand({
            StackName: 'LocalStackApiStack'
        })
    );

    if (!Stacks || !Stacks[0]) {
        throw new Error('Stack not found');
    }

    const outputs = Stacks[0].Outputs;
    const apiUrl = outputs?.find((output) => output.OutputKey === 'ApiUrl')?.OutputValue;
    return apiUrl?.replace(/\/$/, '');
};
