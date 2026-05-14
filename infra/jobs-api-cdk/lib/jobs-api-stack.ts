import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from "aws-cdk-lib/aws-s3";

export class JobsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const jobsTableName = new cdk.CfnParameter(this, "JobsTableName", {
      type: "String",
      description: "Existing DynamoDB table with pipeline jobs.",
    });

    const resultBucketName = new cdk.CfnParameter(this, "ResultBucketName", {
      type: "String",
      description: "Existing S3 bucket with job result files.",
    });

    const presignTtlSeconds = new cdk.CfnParameter(this, "PresignTtlSeconds", {
      type: "Number",
      default: 3600,
      minValue: 60,
      maxValue: 86400,
      description: "TTL for presigned URLs (seconds).",
    });

    const jobsTable = dynamodb.Table.fromTableName(
      this,
      "JobsTable",
      jobsTableName.valueAsString,
    );
    const resultBucket = s3.Bucket.fromBucketName(
      this,
      "ResultBucket",
      resultBucketName.valueAsString,
    );

    const jobsApi = new lambdaNodejs.NodejsFunction(this, "JobsApiFn", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: "lambda/jobs-api/index.ts",
      handler: "handler",
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      bundling: { target: "node20" },
      environment: {
        JOBS_TABLE_NAME: jobsTableName.valueAsString,
        RESULT_BUCKET_NAME: resultBucketName.valueAsString,
        PRESIGN_TTL_SECONDS: presignTtlSeconds.valueAsString,
      },
    });

    jobsTable.grantReadData(jobsApi);
    resultBucket.grantRead(jobsApi);

    const jobsApiUrl = jobsApi.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ["*"],
        allowedMethods: [lambda.HttpMethod.GET],
        allowedHeaders: ["*"],
      },
    });

    const apiOriginDomainName = cdk.Fn.select(2, cdk.Fn.split("/", jobsApiUrl.url));

    const mediaPathRewriteFn = new cloudfront.Function(
      this,
      "MediaPathRewriteFunction",
      {
        code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  if (request.uri === '/media') {
    request.uri = '/';
    return request;
  }

  if (request.uri.startsWith('/media/')) {
    request.uri = request.uri.slice('/media'.length);
  }

  return request;
}`),
      },
    );

    const notFoundFn = new cloudfront.Function(this, "RootNotFoundFunction", {
      code: cloudfront.FunctionCode.fromInline(`
function handler() {
  return {
    statusCode: 404,
    statusDescription: 'Not Found',
    headers: {
      'content-type': { value: 'application/json; charset=utf-8' },
      'cache-control': { value: 'no-store' }
    },
    body: JSON.stringify({ error: 'not found' })
  };
}`),
    });

    const distribution = new cloudfront.Distribution(this, "JobsApiDistribution", {
      comment:
        "Public CloudFront routing for jobs API (/api) and result files (/media).",
      defaultBehavior: {
        origin: new origins.HttpOrigin(apiOriginDomainName),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        functionAssociations: [
          {
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            function: notFoundFn,
          },
        ],
      },
      additionalBehaviors: {
        "api/*": {
          origin: new origins.HttpOrigin(apiOriginDomainName),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
        "media/*": {
          origin: origins.S3BucketOrigin.withOriginAccessControl(resultBucket),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          functionAssociations: [
            {
              eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
              function: mediaPathRewriteFn,
            },
          ],
        },
      },
    });

    jobsApi.addEnvironment(
      "RESULT_PUBLIC_BASE_URL",
      `https://${distribution.distributionDomainName}/media`,
    );

    new cdk.CfnOutput(this, "JobsApiBaseUrl", {
      value: jobsApiUrl.url,
      description: "Public API base URL (AWS-managed domain).",
    });

    new cdk.CfnOutput(this, "CloudFrontBaseUrl", {
      value: `https://${distribution.distributionDomainName}`,
      description: "Public CloudFront base URL.",
    });

    new cdk.CfnOutput(this, "JobsListEndpoint", {
      value: `https://${distribution.distributionDomainName}/api/v1/jobs`,
    });

    new cdk.CfnOutput(this, "HealthEndpoint", {
      value: `https://${distribution.distributionDomainName}/api/healthz`,
    });

    new cdk.CfnOutput(this, "MediaBaseUrl", {
      value: `https://${distribution.distributionDomainName}/media`,
      description: "Public base URL for job result files.",
    });
  }
}
