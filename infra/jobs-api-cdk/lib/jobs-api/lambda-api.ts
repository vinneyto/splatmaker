import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";

export const createJobsApiFunction = (
  scope: cdk.Stack,
  env: {
    jobsTableName: string;
    resultBucketName: string;
    presignTtlSeconds: string;
  },
): lambdaNodejs.NodejsFunction =>
  new lambdaNodejs.NodejsFunction(scope, "JobsApiFn", {
    runtime: lambda.Runtime.NODEJS_20_X,
    entry: "lambda/jobs-api/index.ts",
    handler: "handler",
    timeout: cdk.Duration.seconds(10),
    memorySize: 256,
    bundling: { target: "node20" },
    environment: {
      JOBS_TABLE_NAME: env.jobsTableName,
      RESULT_BUCKET_NAME: env.resultBucketName,
      PRESIGN_TTL_SECONDS: env.presignTtlSeconds,
    },
  });
