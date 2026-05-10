import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class JobsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const jobsTableName = new cdk.CfnParameter(this, 'JobsTableName', {
      type: 'String',
      description: 'Existing DynamoDB table with pipeline jobs.',
    });

    const resultBucketName = new cdk.CfnParameter(this, 'ResultBucketName', {
      type: 'String',
      description: 'Existing S3 bucket with job result files.',
    });

    const resultPublicBaseUrl = new cdk.CfnParameter(this, 'ResultPublicBaseUrl', {
      type: 'String',
      default: '',
      description: 'Optional public base URL for files. If empty, Lambda returns presigned S3 URLs.',
    });

    const presignTtlSeconds = new cdk.CfnParameter(this, 'PresignTtlSeconds', {
      type: 'Number',
      default: 3600,
      minValue: 60,
      maxValue: 86400,
      description: 'TTL for presigned URLs (seconds).',
    });

    const jobsTable = dynamodb.Table.fromTableName(this, 'JobsTable', jobsTableName.valueAsString);
    const resultBucket = s3.Bucket.fromBucketName(this, 'ResultBucket', resultBucketName.valueAsString);

    const jobsApi = new lambdaNodejs.NodejsFunction(this, 'JobsApiFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'lambda/jobs-api/index.ts',
      handler: 'handler',
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      bundling: { target: 'node20' },
      environment: {
        JOBS_TABLE_NAME: jobsTableName.valueAsString,
        RESULT_BUCKET_NAME: resultBucketName.valueAsString,
        RESULT_PUBLIC_BASE_URL: resultPublicBaseUrl.valueAsString,
        PRESIGN_TTL_SECONDS: presignTtlSeconds.valueAsString,
      },
    });

    jobsTable.grantReadData(jobsApi);
    resultBucket.grantRead(jobsApi);

    const jobsApiUrl = jobsApi.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.GET],
        allowedHeaders: ['*'],
      },
    });

    new cdk.CfnOutput(this, 'JobsApiBaseUrl', {
      value: jobsApiUrl.url,
      description: 'Public API base URL (AWS-managed domain).',
    });

    new cdk.CfnOutput(this, 'JobsListEndpoint', {
      value: `${jobsApiUrl.url}api/v1/jobs`,
    });

    new cdk.CfnOutput(this, 'HealthEndpoint', {
      value: `${jobsApiUrl.url}api/healthz`,
    });
  }
}
