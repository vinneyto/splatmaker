import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "node:path";
import { Nextjs } from "cdk-nextjs-standalone";
import { defineStackParameters } from "./jobs-api/parameters.js";
import { createJobsApiFunction } from "./jobs-api/lambda-api.js";
import { createCloudFrontFunctions } from "./jobs-api/cloudfront-functions.js";
import { attachApiAndMediaBehaviors } from "./jobs-api/distribution.js";
import { createOutputs } from "./jobs-api/outputs.js";

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

    const nextjs = new Nextjs(this, "FrontendNextjs", {
      nextjsPath: path.join(process.cwd(), "..", "..", "frontend"),
    });

    const apiOriginDomainName = cdk.Fn.select(2, cdk.Fn.split("/", jobsApiUrl.url));
    const functions = createCloudFrontFunctions(this);

    const distribution = attachApiAndMediaBehaviors({
      distribution: nextjs.distribution.distribution,
      apiOriginDomainName,
      resultBucket,
      functions,
    });

    createOutputs(this, { jobsApiUrl, distribution });
  }
}
