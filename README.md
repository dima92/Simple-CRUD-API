## Локальный запуск
1. Создайте файл .env в корне приложения
2. В созданном файле укажите переменные окружения:
```
HOST=localhost
PORT=<порт, на котором будет запускаться сервис>
```
3. Для установки всех зависимостей выполните комманду
```
npm install
```
4. Для запуска приложения вы можете воспользоваться одним из скриптов:

- development mode via ts-node
  ```
  npm run start:dev
  ```
- production mode
  ```
  npm run start:prod
  ```
- multi mode
  ```
  npm run start:multi
  ```

5. Доступные Rest Endpoints

| Type   | Route         | Explanation       |
|--------|---------------|-------------------|
| Post   | /api/users    | Create user       |
| Get    | /api/users    | Get all users     |
| Get    | /api/users/id | Get user by id    |
| Put    | /api/users/id | Update user by id |
| Delete | /api/users/id | Delete user by id |


6. Данные следует передавать в json формате. Пример валидных данных:
```
{
    "username": "Test User",
    "age": 30,
    "hobbies": ["programming", "guitar"]
}
```
