import * as cdk from "aws-cdk-lib";
import { StackParameters } from "./types.js";

export const defineStackParameters = (scope: cdk.Stack): StackParameters => {
  const jobsTableName = new cdk.CfnParameter(scope, "JobsTableName", {
    type: "String",
    description: "Existing DynamoDB table with pipeline jobs.",
  });

  const jobDetailsTableName = new cdk.CfnParameter(scope, "JobDetailsTableName", {
    type: "String",
    description:
      "Existing DynamoDB table with manual per-job metadata overrides.",
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

  return {
    jobsTableName,
    jobDetailsTableName,
    resultBucketName,
    presignTtlSeconds,
  };
};
