# Splatmaker Minimal Public Jobs API (AWS CDK + Lambda)

Минималистичный IaC-проект под публичный API без авторизации для фотограмметрического pipeline.

## Что разворачивает стек

- AWS Lambda (Node.js 20, TypeScript)
- Lambda Function URL (public, AWS-managed domain, no custom domain)
- Read-only доступ к существующей DynamoDB таблице джобов
- Доступ к существующему S3 bucket с результатами (для presigned ссылок)

## API

- `GET /healthz`
- `GET /v1/jobs?limit=100&offset=0&status=running`
- `GET /v1/jobs/:jobId`

`/v1/jobs/:jobId` возвращает summary + список output files с URL для скачивания.

## Запуск

```bash
npm install
npm run cdk:synth
```

## Deploy

```bash
npm run cdk:deploy -- \
  --parameters JobsTableName=<jobs-table> \
  --parameters ResultBucketName=<results-bucket> \
  --parameters ResultPublicBaseUrl= \
  --parameters PresignTtlSeconds=3600
```

### Про ссылки на файлы

- Если `ResultPublicBaseUrl` пустой, Lambda возвращает **presigned S3 URLs** (рекомендуется).
- Если `ResultPublicBaseUrl` задан (например CloudFront `/results`), Lambda возвращает прямые публичные URL по этому base URL.

## Outputs

- `JobsApiBaseUrl`
- `JobsListEndpoint`
- `HealthEndpoint`
