import * as cdk from "aws-cdk-lib";
import { OutputsDeps } from "./types.js";

export const createOutputs = (scope: cdk.Stack, deps: OutputsDeps): void => {
  const { jobsApiUrl, distribution } = deps;

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

  new cdk.CfnOutput(scope, "FrontendBaseUrl", {
    value: `https://${distribution.distributionDomainName}`,
    description: "Public frontend URL served through CloudFront.",
  });

  new cdk.CfnOutput(scope, "MediaBaseUrl", {
    value: `https://${distribution.distributionDomainName}/media`,
    description: "Public base URL for job result files.",
  });
};
