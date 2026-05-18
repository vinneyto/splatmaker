import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";

export type StackParameters = {
  jobsTableName: cdk.CfnParameter;
  resultBucketName: cdk.CfnParameter;
  presignTtlSeconds: cdk.CfnParameter;
};

export type CloudFrontFunctions = {
  mediaPathRewriteFn: cloudfront.Function;
  apiForwardHostFn: cloudfront.Function;
};

export type DistributionDeps = {
  apiOriginDomainName: string;
  frontendBucket: s3.IBucket;
  resultBucket: s3.IBucket;
  functions: CloudFrontFunctions;
};

export type OutputsDeps = {
  jobsApiUrl: lambda.FunctionUrl;
  distribution: cloudfront.Distribution;
};
