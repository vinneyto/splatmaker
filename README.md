# Splatmaker Monorepo Skeleton

Сейчас в репозитории вынесен только backend infra-модуль для публичного jobs API.

- CDK + Lambda модуль лежит в: `infra/jobs-api-cdk`
- Позже сюда же можно добавить frontend как отдельную папку (например `frontend/`)

## Jobs API stack

См. подробности в:
- `infra/jobs-api-cdk/README.md`

Быстрый старт по окружению:
- скопировать шаблон: `cp infra/jobs-api-cdk/.env.example infra/jobs-api-cdk/.env`
- заполнить значения в `.env`
