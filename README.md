# Splatmaker

Splatmaker is a companion project for the AWS Solutions Library guidance:

- https://github.com/aws-solutions-library-samples/guidance-for-open-source-3d-reconstruction-toolbox-for-gaussian-splats-on-aws

This repository adds a public Jobs API layer that lets you:

- list reconstruction jobs,
- open job details,
- open reconstruction result files through CloudFront (`/media/*`).

## Repository structure

- `infra/jobs-api-cdk` — AWS CDK stack + Lambda for Jobs API and media routing.
- `frontend/` — frontend workspace (optional, can be developed independently).

## Setup and deployment

See the full step-by-step guide here:

- `infra/jobs-api-cdk/README.md`
