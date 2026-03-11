# ТЛНОУ MVP Architecture

## С чего начать и как не утонуть

1. Сначала соберите один вертикальный срез: `admin создаёт пользователя -> пользователь логинится по ID/паролю -> видит защищённую ленту`.
2. Жёстко разделите домены: auth, social (posts/profiles/channels/chats), archive (memory board), admin.
3. Делайте фичи по thin-slice этапам: backend + UI + базовая валидация + happy-path тест на каждом этапе.
4. Любую новую механику добавляйте только после того, как предыдущая реально проходит end-to-end.

## 1. Product Summary

ТЛНОУ - закрытая мини-соцсеть для учебной группы: личные аккаунты, лента, профили, лайки/комментарии, чаты, один личный канал на участника, подписки на каналы, и отдельная архивная «Доска воспоминаний» для бывших участников. Без публичной регистрации: все аккаунты заранее создаёт администратор.

## 2. Recommended Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- PostgreSQL (Supabase Postgres)
- Prisma ORM
- Cookie sessions (custom session table + secure httpOnly cookie)

## 3. Architecture

- `app/(public)` - публичные страницы (`/login`).
- `app/(app)` - защищённая зона после авторизации.
- `app/(app)/admin` - админский контур.
- `app/api/*` - route handlers для login/logout/admin CRUD.
- `lib/auth/*` - безопасность (hash, session, rate limit, guards).
- `lib/prisma.ts` - единый клиент БД.
- `prisma/schema.prisma` - единая схема домена.

## 4. Folder Structure

```txt
src/
  app/
    (public)/login
    (app)/
      feed chats profile channel memory post
      admin/users
    api/auth
    api/admin
  components/
  lib/
    auth/
    validators/
prisma/
  schema.prisma
  seed.ts
docs/
  MVP_ARCHITECTURE.md
```

## 5. DB Schema (high-level)

- `users`, `credentials`, `profiles`, `sessions`, `login_attempts`
- `posts`, `post_media`, `post_likes`, `post_comments`
- `chat_rooms`, `chat_members`, `chat_messages`
- `channels`, `channel_subscriptions`, `channel_posts`, `channel_post_media`, `channel_post_likes`
- `memory_board_entries`, `memory_board_media`

## 6. Auth Flow

1. Админ создаёт пользователя (`identifier + password` + profile fields + optional avatar).
2. Пользователь логинится через `/login`.
3. Пароль проверяется по `bcrypt hash`.
4. Создаётся запись `sessions` + secure `httpOnly` cookie (`SameSite=Lax`).
5. Все приватные роуты требуют валидную сессию.
6. Basic brute-force защита: окно попыток в `login_attempts` по `identifier/ip`.

## 7. User Flows

- Login -> Feed
- Feed: user posts + channel posts из подписок
- Chats: выбор комнаты + отправка сообщений
- Profile: bio, текстовые блоки и список постов
- Channel: просмотр, подписка/отписка, посты владельца
- Memory board: read-only архив

## 8. Admin Flows

- Создать аккаунт участника
- Загрузить фото профиля участника
- Редактировать базовые данные аккаунта
- Управлять архивными карточками memory board
- Управлять статусом активных/архивных участников

## 9. MVP Screens

- Login
- Feed
- Chats
- Own profile
- Other user profile
- Create/edit post
- Edit profile
- Channel page
- Create channel
- Memory board
- Admin users
- Admin memory board
- Not found / forbidden / empty states

## 10. Roadmap

- Stage 1: bootstrap + DB schema + auth/session + admin create users + protected feed
- Stage 2: profile edit (без редактирования admin-полей)
- Stage 3: text posts create/edit/delete + likes/comments
- Stage 4: chats MVP + UI polish navigation + admin avatar upload
- Stage 5: media upload + preview + limits for user posts
- Stage 6: channels + subscriptions + channel posts CRUD
- Stage 7: memory board full admin CRUD + media

## 11. TODO / Future Enhancements

- Telegram Lessons bot integration hooks (without implementation now)
- Deep links from Telegram to feed/channel/memory entries
- Notification center (new posts, mentions, channel updates)
- Additional reactions beyond likes
- Group events and schedule announcements
