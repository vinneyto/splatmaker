import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineStackParameters } from "./jobs-api/parameters.js";
import { createJobsApiFunction } from "./jobs-api/lambda-api.js";
import { createCloudFrontFunctions } from "./jobs-api/cloudfront-functions.js";
import { createDistribution } from "./jobs-api/distribution.js";
import { createOutputs } from "./jobs-api/outputs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    const frontendBucket = new s3.Bucket(this, "FrontendBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      autoDeleteObjects: false,
      versioned: false,
    });

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

    const apiOriginDomainName = cdk.Fn.select(2, cdk.Fn.split("/", jobsApiUrl.url));
    const functions = createCloudFrontFunctions(this);

    const distribution = createDistribution(this, {
      apiOriginDomainName,
      resultBucket,
      frontendBucket,
      functions,
    });

    new s3deploy.BucketDeployment(this, "FrontendDeployment", {
      destinationBucket: frontendBucket,
      distribution,
      distributionPaths: ["/*"],
      sources: [
        s3deploy.Source.asset(path.join(__dirname, "..", "..", "..", "frontend"), {
          bundling: {
            image: cdk.DockerImage.fromRegistry("public.ecr.aws/docker/library/node:20"),
            command: [
              "bash",
              "-lc",
              [
                "npm ci",
                "npm run build",
                "cp -r out/. /asset-output/",
              ].join(" && "),
            ],
          },
        }),
      ],
    });

    createOutputs(this, { jobsApiUrl, distribution });
  }
}
