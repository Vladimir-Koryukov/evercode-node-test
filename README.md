# Evercode Node Test

Учебный проект

## Общее описание

- Планировщик, выводящий сообщение каждые N секунд
- Express web-сервер
- Публичный endpoint `/status`
- Авторизация через Bearer token
- CRUD API для валют
- Хранение информации о валютах в памяти приложения
- Endpoint для получения цен валют из внешнего API Binance
- Пользовательские ошибки приложения
- Тесты на Jest и supertest
- OpenAPI- контракт для всех endpoint

## Работа приложения

В корне проекта требуется создать файл `.env` и поместить в него токен длиной 64 символа:

AUTHORIZATION_TOKEN=64_symbols_token

Для запуска сервера используется команда `npm start`. Сервер запускается по адресу `http://localhost:3001`.

Для запуска планировщика `npm run scheduler`.

Для запуска тестов `npm test`.

Защищенные endpoints требуют заголовок `Authorization: Bearer <token>`.

Описание всех endpoints находится в `src/docs/openapi.yaml`.
