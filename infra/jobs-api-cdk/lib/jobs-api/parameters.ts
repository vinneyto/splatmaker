import * as cdk from "aws-cdk-lib";
import { StackParameters } from "./types.js";

export const defineStackParameters = (scope: cdk.Stack): StackParameters => {
  const jobsTableName = new cdk.CfnParameter(scope, "JobsTableName", {
    type: "String",
    description: "Existing DynamoDB table with pipeline jobs.",
  });

  const resultBucketName = new cdk.CfnParameter(scope, "ResultBucketName", {
    type: "String",
    description: "Existing S3 bucket with job result files.",
  });

  const presignTtlSeconds = new cdk.CfnParameter(scope, "PresignTtlSeconds", {
    type: "Number",
    default: 3600,
    minValue: 60,
    maxValue: 86400,
    description: "TTL for presigned URLs (seconds).",
  });

  const cognitoDomainPrefix = new cdk.CfnParameter(scope, "CognitoDomainPrefix", {
    type: "String",
    default: "splatmaker-jobs-auth-example",
    allowedPattern: "^[a-z0-9-]+$",
    description:
      "Cognito Hosted UI domain prefix (must be globally unique in region).",
  });

  const cognitoCallbackUrl = new cdk.CfnParameter(scope, "CognitoCallbackUrl", {
    type: "String",
    default: "http://localhost:3000/jobs",
    description: "OAuth callback URL for the frontend app.",
  });

  const cognitoLogoutUrl = new cdk.CfnParameter(scope, "CognitoLogoutUrl", {
    type: "String",
    default: "http://localhost:3000/jobs",
    description: "OAuth logout URL for the frontend app.",
  });

  return {
    jobsTableName,
    resultBucketName,
    presignTtlSeconds,
    cognitoDomainPrefix,
    cognitoCallbackUrl,
    cognitoLogoutUrl,
  };
};
