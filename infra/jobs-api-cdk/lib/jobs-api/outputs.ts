import * as cdk from "aws-cdk-lib";
import { OutputsDeps } from "./types.js";

export const createOutputs = (scope: cdk.Stack, deps: OutputsDeps): void => {
  const {
    jobsApiUrl,
    distribution,
    cognitoDomainPrefix,
    cognitoUserPoolId,
    cognitoUserPoolClientId,
  } = deps;

  new cdk.CfnOutput(scope, "JobsApiBaseUrl", {
    value: jobsApiUrl.url,
    description: "Public API base URL (AWS-managed domain).",
  });

  new cdk.CfnOutput(scope, "CloudFrontBaseUrl", {
    value: `https://${distribution.distributionDomainName}`,
    description: "Public CloudFront base URL.",
  });

  new cdk.CfnOutput(scope, "JobsListEndpoint", {
    value: `https://${distribution.distributionDomainName}/api/v1/jobs`,
  });

  new cdk.CfnOutput(scope, "HealthEndpoint", {
    value: `https://${distribution.distributionDomainName}/api/healthz`,
  });

  new cdk.CfnOutput(scope, "MediaBaseUrl", {
    value: `https://${distribution.distributionDomainName}/media`,
    description: "Public base URL for job result files.",
  });

  new cdk.CfnOutput(scope, "CognitoUserPoolId", {
    value: cognitoUserPoolId,
    description: "Cognito User Pool ID (example auth).",
  });

  new cdk.CfnOutput(scope, "CognitoUserPoolClientId", {
    value: cognitoUserPoolClientId,
    description: "Cognito User Pool Client ID (example auth).",
  });

  new cdk.CfnOutput(scope, "CognitoHostedUiBaseUrl", {
    value: `https://${cognitoDomainPrefix}.auth.${scope.region}.amazoncognito.com`,
    description: "Cognito Hosted UI base URL.",
  });
};
