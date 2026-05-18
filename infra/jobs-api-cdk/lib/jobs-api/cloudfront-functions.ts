import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as path from "node:path";
import { readFileSync } from "node:fs";
import { CloudFrontFunctions } from "./types.js";

const loadFunctionCode = (fileName: string): cloudfront.FunctionCode => {
  const functionPath = path.join(process.cwd(), "lib", "jobs-api", "cloudfront-functions", fileName);
  return cloudfront.FunctionCode.fromInline(readFileSync(functionPath, "utf8"));
};

export const createCloudFrontFunctions = (scope: cdk.Stack): CloudFrontFunctions => {
  const mediaPathRewriteFn = new cloudfront.Function(scope, "MediaPathRewriteFunction", {
    code: loadFunctionCode("media-path-rewrite.js"),
  });

  const apiForwardHostFn = new cloudfront.Function(scope, "ApiForwardHostFunction", {
    code: loadFunctionCode("api-forward-host.js"),
  });

  return { mediaPathRewriteFn, apiForwardHostFn };
};
