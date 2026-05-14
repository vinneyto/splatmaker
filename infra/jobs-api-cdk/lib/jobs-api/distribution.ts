import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { DistributionDeps } from "./types.js";

export const createDistribution = (
  scope: cdk.Stack,
  deps: DistributionDeps,
): cloudfront.Distribution => {
  const { apiOriginDomainName, resultBucket, functions } = deps;

  return new cloudfront.Distribution(scope, "JobsApiDistribution", {
    comment: "Public CloudFront routing for jobs API (/api) and result files (/media).",
    defaultBehavior: {
      origin: new origins.HttpOrigin(apiOriginDomainName),
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      functionAssociations: [
        {
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          function: functions.notFoundFn,
        },
      ],
    },
    additionalBehaviors: {
      "api/*": {
        origin: new origins.HttpOrigin(apiOriginDomainName),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        functionAssociations: [
          {
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            function: functions.apiForwardHostFn,
          },
        ],
      },
      "media/*": {
        origin: origins.S3BucketOrigin.withOriginAccessControl(resultBucket),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          {
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            function: functions.mediaPathRewriteFn,
          },
        ],
      },
    },
  });
};
