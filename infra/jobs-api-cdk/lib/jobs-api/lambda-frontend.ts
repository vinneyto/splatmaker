import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "node:path";

export const createFrontendRuntimeFunction = (
  scope: cdk.Stack,
): lambda.Function => {
  const frontendStandalonePath = path.join(
    process.cwd(),
    "..",
    "..",
    "frontend",
    ".next",
    "standalone",
  );

  return new lambda.Function(scope, "FrontendRuntimeFunction", {
    runtime: lambda.Runtime.NODEJS_20_X,
    architecture: lambda.Architecture.ARM_64,
    handler: "server.handler",
    memorySize: 1024,
    timeout: cdk.Duration.seconds(29),
    code: lambda.Code.fromAsset(frontendStandalonePath),
    environment: {
      NODE_ENV: "production",
      PORT: "8080",
      HOSTNAME: "0.0.0.0",
    },
  });
};
