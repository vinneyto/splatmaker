#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MinimalPublicJobsApiStack } from '../lib/minimal-public-jobs-api-stack.js';

const app = new cdk.App();

new MinimalPublicJobsApiStack(app, 'SplatmakerMinimalPublicJobsApiStack', {
  description: 'Public read-only jobs API (Lambda Function URL) for Splatmaker photogrammetry pipeline.',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
