# FocusEngine frontend (React + Vite)

Talks to the FocusEngine backend (Node, Express, MongoDB Atlas).

## Run it
1. Start the backend first (`npm run dev` in the backend folder; you should see "API on port 5000").
2. In THIS folder:
   ```
   npm install
   npm run dev
   ```
3. Open http://localhost:5173, click "Create an account", then explore.

The Vite dev server forwards `/api`, `/uploads` and `/socket.io` to http://localhost:5000
(see `vite.config.js`), so the code uses plain relative URLs and you never fight CORS.
Keep `CLIENT_URL=http://localhost:5173` in the backend `.env`.

## How it is organised
```
src/
  api.js          fetch wrapper: adds the JWT, throws readable errors
  auth.jsx        login / register / logout + current user (React context)
  tasks.jsx       task list shared by Dashboard, Tasks and Calendar (React context)
  App.jsx         routes; shows <Login/> until you are logged in
  components/     Layout (sidebar + top bar), TaskItem, TaskForm, Kpi, Charts, Avatar
  pages/          Dashboard, Tasks, Calendar, Focus, Analytics, Profile, Chat, Login
```

## What each page calls
| Page | API |
|---|---|
| Login | POST /api/auth/register, /api/auth/login, GET /api/auth/me |
| Tasks, Calendar, Dashboard | GET/POST/PATCH/DELETE /api/tasks |
| Focus | POST /api/focus when a timer ends, GET /api/focus |
| Analytics, Dashboard, Profile | GET /api/analytics/overview?days=7 or 30 |
| Profile | POST /api/upload then PATCH /api/auth/me (photo, name, bio) |
| Chat | GET /api/chat/general/messages + Socket.IO (room:join, message:send, message:new) |

## Good interview talking points
- JWT stored in localStorage and sent as a Bearer header; the server filters every query by user id.
- Focus timer counts down from an end timestamp, so it stays accurate if the tab is throttled.
- Charts are plain SVG/CSS, no chart library.
- Real-time chat over Socket.IO with the same JWT.

## Known limits
- Styling is one plain CSS file (the "Productivity Pro" theme), not Tailwind.
- Focus days are counted in UTC by the backend, so a session between midnight and 5:30 am India time lands on the previous day.
- Chat has one shared "general" room (the backend also supports private rooms; no UI yet).
- No cover photo (only profile photo). No automated tests yet.
