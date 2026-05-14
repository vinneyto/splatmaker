import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { CloudFrontFunctions } from "./types.js";

export const createCloudFrontFunctions = (scope: cdk.Stack): CloudFrontFunctions => {
  const mediaPathRewriteFn = new cloudfront.Function(scope, "MediaPathRewriteFunction", {
    code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  if (request.uri === '/media') {
    request.uri = '/';
    return request;
  }

  if (request.uri.startsWith('/media/')) {
    request.uri = request.uri.slice('/media'.length);
  }

  return request;
}`),
  });

  const apiForwardHostFn = new cloudfront.Function(scope, "ApiForwardHostFunction", {
    code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var hostHeader = request.headers.host;
  if (hostHeader && hostHeader.value) {
    request.headers['x-public-host'] = { value: hostHeader.value };
  }

  var protoHeader = request.headers['cloudfront-forwarded-proto'];
  if (protoHeader && protoHeader.value) {
    request.headers['x-public-proto'] = { value: protoHeader.value };
  }

  return request;
}`),
  });

  const notFoundFn = new cloudfront.Function(scope, "RootNotFoundFunction", {
    code: cloudfront.FunctionCode.fromInline(`
function handler() {
  return {
    statusCode: 404,
    statusDescription: 'Not Found',
    headers: {
      'content-type': { value: 'application/json; charset=utf-8' },
      'cache-control': { value: 'no-store' }
    },
    body: JSON.stringify({ error: 'not found' })
  };
}`),
  });

  return { mediaPathRewriteFn, apiForwardHostFn, notFoundFn };
};
