# ТЛНОУ (MVP)

Закрытая мини-соцсеть для учебной группы на Next.js + TypeScript + Tailwind + Prisma + PostgreSQL.

## Что уже реализовано

- Архитектурный каркас MVP
- Полная Prisma-схема домена
- Авторизация по `identifier + password`
- Сессии в secure httpOnly cookie
- Базовый rate limiting для login
- Admin area: создание аккаунтов пользователей
- Загрузка фото профиля при создании пользователя в админке
- Рабочее редактирование профиля (без изменения админ-полей)
- Текстовые пользовательские посты: create/edit/delete
- Лайки и комментарии к пользовательским постам
- Раздел `Чаты` (комнаты + отправка сообщений)
- Защищённые экраны: feed/chats/profile/channel/memory
- Базовые страницы ошибок и пустых состояний

## Быстрый старт

1. Установить зависимости:

```bash
npm install
```

2. Подготовить переменные:

```bash
cp .env.example .env
```

3. Подключить PostgreSQL (локально или Supabase) в `DATABASE_URL`.
Если локальный Postgres уже занят на `5432`, используйте порт `5433` (текущий `.env.example` именно такой).

4. Накатить схему:

```bash
npm run db:push
```

5. Сгенерировать seed-данные (включая первого админа):

```bash
npm run db:seed
```

6. Запустить приложение:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

## Вход по умолчанию (если не переопределяли env)

- ID: `1001`
- Пароль: `ChangeMe123!`

## Документация

- Архитектура и roadmap: [docs/MVP_ARCHITECTURE.md](./docs/MVP_ARCHITECTURE.md)

## Следующие этапы

- Stage 4: медиа для постов (фото/видео upload + preview + ограничения)
- Stage 5: channels full flow + subscriptions + channel posts CRUD
- Stage 6: memory board CRUD + media upload
