import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";

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

    const resultPublicBaseUrl = new cdk.CfnParameter(
      this,
      "ResultPublicBaseUrl",
      {
        type: "String",
        default: "",
        description:
          "Optional public base URL for files. If empty, Lambda returns presigned S3 URLs.",
      },
    );

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
        RESULT_PUBLIC_BASE_URL: resultPublicBaseUrl.valueAsString,
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

    const frontendBucket = new s3.Bucket(this, "FrontendBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new s3deploy.BucketDeployment(this, "DeployFrontend", {
      destinationBucket: frontendBucket,
      sources: [
        s3deploy.Source.asset("../../frontend", {
          bundling: {
            image: cdk.DockerImage.fromRegistry("public.ecr.aws/docker/library/node:20"),
            command: [
              "bash",
              "-lc",
              "npm ci && npm run build && cp -R out/* /asset-output/",
            ],
          },
        }),
      ],
      prune: true,
    });

    const lambdaFunctionUrlDomain = cdk.Fn.select(
      2,
      cdk.Fn.split("/", jobsApiUrl.url),
    );

    const distribution = new cloudfront.Distribution(this, "FrontendDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(frontendBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        "api/*": {
          origin: new origins.HttpOrigin(lambdaFunctionUrlDomain, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(1),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(1),
        },
      ],
    });

    new cdk.CfnOutput(this, "JobsApiBaseUrl", {
      value: jobsApiUrl.url,
      description: "Public API base URL (AWS-managed domain).",
    });

    new cdk.CfnOutput(this, "CloudFrontDomainName", {
      value: distribution.domainName,
      description: "Frontend + API domain (same origin via CloudFront).",
    });

    new cdk.CfnOutput(this, "FrontendUrl", {
      value: `https://${distribution.domainName}`,
    });

    new cdk.CfnOutput(this, "JobsListEndpoint", {
      value: `https://${distribution.domainName}/api/v1/jobs`,
    });

    new cdk.CfnOutput(this, "HealthEndpoint", {
      value: `https://${distribution.domainName}/api/healthz`,
    });
  }
}
