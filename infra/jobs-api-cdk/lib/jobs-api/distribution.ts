import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { DistributionDeps } from "./types.js";

export const attachApiAndMediaBehaviors = (deps: DistributionDeps): cloudfront.Distribution => {
  const { distribution, resultBucket, functions } = deps;

  distribution.addBehavior("media/*", origins.S3BucketOrigin.withOriginAccessControl(resultBucket), {
    allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
    functionAssociations: [
      {
        eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        function: functions.mediaPathRewriteFn,
      },
    ],
  });

  return distribution;
};
