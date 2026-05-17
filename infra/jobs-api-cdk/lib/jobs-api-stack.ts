import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { defineStackParameters } from "./jobs-api/parameters.js";
import { createJobsApiFunction } from "./jobs-api/lambda-api.js";
import { createCloudFrontFunctions } from "./jobs-api/cloudfront-functions.js";
import { createDistribution } from "./jobs-api/distribution.js";
import { createOutputs } from "./jobs-api/outputs.js";
import { createFrontendRuntimeFunction } from "./jobs-api/lambda-frontend.js";

export class JobsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { jobsTableName, resultBucketName, presignTtlSeconds } = defineStackParameters(this);

    const jobsTable = dynamodb.Table.fromTableName(this, "JobsTable", jobsTableName.valueAsString);
    const resultBucket = s3.Bucket.fromBucketName(
      this,
      "ResultBucket",
      resultBucketName.valueAsString,
    );

    const jobsApi = createJobsApiFunction(this, {
      jobsTableName: jobsTableName.valueAsString,
      resultBucketName: resultBucketName.valueAsString,
      presignTtlSeconds: presignTtlSeconds.valueAsString,
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

    const frontendRuntime = createFrontendRuntimeFunction(this, {
      apiBaseUrl: jobsApiUrl.url.replace(/\/$/, ""),
    });

    const frontendUrl = frontendRuntime.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    const apiOriginDomainName = cdk.Fn.select(2, cdk.Fn.split("/", jobsApiUrl.url));
    const frontendOriginDomainName = cdk.Fn.select(2, cdk.Fn.split("/", frontendUrl.url));

    const functions = createCloudFrontFunctions(this);

    const distribution = createDistribution(this, {
      apiOriginDomainName,
      frontendOriginDomainName,
      resultBucket,
      functions,
    });

    createOutputs(this, { jobsApiUrl, frontendUrl, distribution });
  }
}
