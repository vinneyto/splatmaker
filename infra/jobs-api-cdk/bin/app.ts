#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { JobsApiStack } from '../lib/jobs-api-stack.js';

const app = new cdk.App();

new JobsApiStack(app, 'SplatmakerJobsApiStack', {
  description: 'Public read-only jobs API (Lambda Function URL) for Splatmaker photogrammetry pipeline.',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
