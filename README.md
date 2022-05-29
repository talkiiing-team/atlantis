# Atlantis

## Локальный запуск

```
docker-compose up -d
```

Обратите внимание, что в `client/src/services/pokeCore` в качестве
baseUrl должен быть указан итоговый URL atlantis-api. Если тестирование
происходит локально, укажите `http://localhost:8091`

## Структура

### antlantis-py

Алгоритмы на Python с использованием ML-моделей.

### atlantis-api

Бэкенд на Node.js + Fastify, являющийся посредником между клиентом и
Python. Позволяет загрузить базы данных в виде `csv` файлов.

### client

Веб-приложение на React.
