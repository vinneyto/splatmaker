import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { DistributionDeps } from "./types.js";

export const createDistribution = (
  scope: cdk.Stack,
  deps: DistributionDeps,
): cloudfront.Distribution => {
  const { apiOriginDomainName, resultBucket, frontendBucket, functions } = deps;

  return new cloudfront.Distribution(scope, "JobsApiDistribution", {
    comment:
      "Public CloudFront routing for frontend (/), jobs API (/api), and result files (/media).",
    defaultRootObject: "index.html",
    defaultBehavior: {
      origin: origins.S3BucketOrigin.withOriginAccessControl(frontendBucket),
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      functionAssociations: [
        {
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          function: functions.frontendSpaRewriteFn,
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
