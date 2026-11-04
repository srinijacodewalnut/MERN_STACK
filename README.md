# React + TypeScript + Bun starter

A beginner-friendly full-stack application called **Daybook**. The React frontend lets you add, complete, filter, and delete tasks. The Bun backend validates requests and stores tasks in memory.

Use this project to learn how a browser interface talks to an API, how TypeScript describes data on both sides, and how to run everything with Bun.

> Tasks survive browser refreshes while the backend is running. They reset whenever the backend restarts, including a restart caused by editing backend code. This starter has no database or login.

## 1. Technology stack: what it is and why it is here

| Technology | One-line definition | Why it is used |
| --- | --- | --- |
| React | A JavaScript library for building interfaces from reusable components. | Renders the task list and updates the interface when state changes. |
| TypeScript | JavaScript with types that catch mistakes before code runs. | Checks task data, UI code, and API calls across the frontend and backend. |
| Bun | A JavaScript and TypeScript runtime with a package manager and test runner. | Installs dependencies, runs scripts, executes the backend, and runs tests. |
| Bun.serve | Bun's built-in HTTP server API. | Provides a backend without installing an additional server framework. |
| Vite | A frontend development server and production build tool. | Provides React Fast Refresh, a local API proxy, and optimized browser assets. |
| HTML | The markup language that defines a web page's structure. | Provides the document and root element where React mounts. |
| CSS | The styling language for web pages. | Controls colors, spacing, responsive layouts, and focus states. |
| Fetch API | A browser API for making HTTP requests. | Sends task operations from React to Bun without an extra HTTP library. |
| Git | A version control system that records changes as commits. | Makes changes reviewable and preserves project history. |

**About the repository name:** the folder is called `MERN_STACK`, but this implementation uses React, TypeScript, Vite, and Bun. Traditional MERN means MongoDB, Express, React, and Node.js. MongoDB and Express are not installed, and the backend runs on Bun.

Dependency versions live in `package.json`; `bun.lock` records the exact resolved versions. Commit the lockfile so other developers can install the same dependencies.

## 2. Prerequisites

- **Bun 1.3.0 or newer** on a supported Windows, macOS, or Linux system. Developed with Bun 1.4.4.
- A current browser and a code editor such as VS Code.
- Git if you want to create commits.

Node.js and npm are not required for these commands; the Vite scripts explicitly run under Bun.

```sh
bun --version
git --version
```

If Bun is missing, use the [official installation guide](https://bun.sh/docs/installation). Its Windows PowerShell installation command is:

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

Reopen your terminal afterward. If Bun is already installed but `bun` is not recognized, add its directory to the **current terminal session's** PATH:

```powershell
$env:Path = "$env:USERPROFILE\.bun\bin;$env:Path"
bun --version
```

Alternatively, call the executable directly:

```powershell
& "$env:USERPROFILE\.bun\bin\bun.exe" install
& "$env:USERPROFILE\.bun\bin\bun.exe" run dev
```

## 3. Install and run

Run commands from the repository root: the folder containing `package.json`.

For this workspace in PowerShell:

```powershell
cd C:\Users\LENOVO\Desktop\MERN_STACK
bun install
bun run dev
```

On another computer, open a terminal in your clone instead of using the machine-specific path above.

Open **http://127.0.0.1:5173** in your browser.

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:3001`
- Backend health: `http://127.0.0.1:3001/api/health`
- Stop both development servers with **Ctrl+C**.

`bun run dev` starts both servers in parallel. Saving a frontend file refreshes the interface; saving a backend file restarts the API and resets its in-memory tasks.

### Run frontend and backend separately

Open two terminals in the repository root. This helps you see which logs come from which server:

```sh
# Terminal 1
bun run dev:backend
```

```sh
# Terminal 2
bun run dev:frontend
```

Choose either the combined command or the two-terminal approach. Starting both approaches together creates duplicate servers and port conflicts.

### Try the interface

1. Check that the header shows **API connected**.
2. Enter a task and select **Add task**, or press Enter.
3. Select its checkbox to mark it completed.
4. Switch between **All**, **Active**, and **Completed**.
5. Select the trash button to delete a task.
6. Refresh: tasks are fetched again from the running backend.

## 4. All commands

| Command | What it does |
| --- | --- |
| `bun install` | Installs all dependencies from the root package. |
| `bun install --frozen-lockfile` | Installs locked dependencies and fails if the lockfile and manifest disagree; useful in CI. |
| `bun run dev` | Starts both development servers with prefixed logs. |
| `bun run dev:frontend` | Starts only Vite on port 5173. |
| `bun run dev:backend` | Starts only the Bun API on port 3001 with automatic restarts. |
| `bun run typecheck` | Checks frontend, backend, shared types, configuration, and backend tests without emitting JavaScript. |
| `bun run test` | Runs backend API tests using Bun's test runner. |
| `bun run check` | Runs type checking and backend tests. |
| `bun run build` | Type-checks everything and builds the frontend into `dist/frontend`. |
| `bun run start` | Serves the built frontend and API together using Bun in production mode. |

### Run a production build locally

Stop development servers first, because the backend uses the same port in both modes:

```sh
bun run build
bun run start
```

Open **http://127.0.0.1:3001**. A separate Vite server is not needed. Bun executes the backend TypeScript directly; the build command creates browser assets, not a separate backend bundle.

This starter binds to `127.0.0.1` for local use. Public hosting would also need an appropriate listening address, deployment configuration, persistent storage, and any authentication your product requires.

## 5. Folder structure: what each file does

```text
MERN_STACK/
├── frontend/
│   ├── index.html          # Document, page metadata, and React mount point
│   ├── public/
│   │   └── favicon.svg     # Browser tab icon
│   ├── src/
│   │   ├── main.tsx        # React entry point; imports CSS
│   │   ├── App.tsx         # Task interface, form, filters, and UI state
│   │   ├── api.ts          # Typed HTTP requests to the backend
│   │   └── styles.css      # Colors, layout, and responsive styling
│   ├── tsconfig.json       # Browser TypeScript settings
│   └── vite.config.ts      # React plugin, dev port, proxy, and build output
├── backend/
│   ├── src/
│   │   ├── app.ts          # Routes, validation, and in-memory task store
│   │   ├── app.test.ts     # API behavior and validation tests
│   │   └── server.ts       # Bun startup and production file serving
│   └── tsconfig.json       # Backend TypeScript settings and Bun types
├── shared/
│   └── types.ts            # Task, health, and error data contracts
├── .env.example            # Optional environment setting examples
├── .gitignore              # Excludes dependencies, builds, and local secrets
├── bun.lock                # Exact resolved dependency versions
├── package.json            # Dependencies and runnable commands
├── tsconfig.json           # Shared strict TypeScript rules
└── README.md               # Setup and editing guide
```

`node_modules/` is generated by installation. `dist/frontend/` is generated by a build. Both are ignored by Git; edit source files instead. The existing empty `agents.md` is independent of application setup.

### Which file should I change?

| I want to… | Files to change | Why |
| --- | --- | --- |
| Change headings, buttons, or page content | `frontend/src/App.tsx` | Describes what the interface displays. |
| Change colors, fonts, spacing, or mobile layout | `frontend/src/styles.css` | Contains all application styling. |
| Change the browser tab title or description | `frontend/index.html` | Holds document metadata. |
| Change the tab icon | `frontend/public/favicon.svg` | Public assets are copied into the build. |
| Change React initialization | `frontend/src/main.tsx` | Mounts the application. |
| Add or change an API endpoint | `backend/src/app.ts` and `backend/src/app.test.ts` | Defines and tests route behavior. |
| Call a new endpoint from React | `frontend/src/api.ts`, then `frontend/src/App.tsx` | Add the request function and connect it to the UI. |
| Add a task field such as `priority` | `shared/types.ts`, `backend/src/app.ts`, `frontend/src/api.ts`, `frontend/src/App.tsx`, and `backend/src/app.test.ts` | Keep the type, validation, requests, display, and tests consistent. |
| Add a database | `backend/src/app.ts`, optionally new `backend/src/db.ts`, and `.env` | Replace the in-memory Map with persistent backend data access. |
| Change the backend port | Root `.env`, copied from `.env.example` | Bun and Vite's proxy both read `PORT`; restart both servers. |
| Change the frontend port | `frontend/vite.config.ts` | Vite owns the browser development server. |
| Change production host or file serving | `backend/src/server.ts` | Starts Bun and serves built assets. |
| Add a dependency or script | Root `package.json` | Controls the entire project. Use `bun add` to update the lockfile too. |
| Change compiler rules | Root or frontend/backend `tsconfig.json` | Shared rules apply to both sides; overrides apply to one environment. |

When adding a field, update the shared type, backend validation and creation, API helper, React input/display, and tests. Run `bun run check` and `bun run build` afterward. TypeScript types do not validate HTTP request bodies at runtime; keep explicit backend validation.

## 6. How it works

```text
Development:
Browser on port 5173
  → React event handler in App.tsx
  → fetch('/api/tasks') in api.ts
  → Vite proxy forwards /api to Bun on port 3001
  → server.ts calls the API handler in app.ts
  → app.ts validates input and reads/writes its Map
  → JSON response returns to React
  → React updates state and renders the result

Production:
Browser on port 3001
  → Bun serves dist/frontend and /api from the same origin
```

Relative `/api` URLs work in both modes. The development proxy avoids cross-origin browser requests; production uses one server for the interface and API.

The app starts with an empty task list. It includes loading states, disabled controls during saves, server error messages, a retry action, accessible task labels, and responsive CSS.

### API reference

| Method | Endpoint | Request body | Success response |
| --- | --- | --- | --- |
| GET | `/api/health` | None | `200`, `{ "status": "ok", "runtime": "Bun <version>" }` |
| GET | `/api/tasks` | None | `200`, array of tasks, newest first |
| POST | `/api/tasks` | `{ "title": "Learn React" }` | `201`, created task |
| PATCH | `/api/tasks/:id` | `{ "completed": true }` | `200`, updated task |
| DELETE | `/api/tasks/:id` | None | `200`, `{ "success": true }` |

Example task:

```json
{
  "id": "generated-uuid",
  "title": "Learn React",
  "completed": false,
  "createdAt": "2026-11-04T10:00:00.000Z"
}
```

Titles are trimmed and must contain 1–120 characters. Completion values must be booleans. Invalid data or malformed JSON returns `400`, missing tasks/routes return `404`, and unsupported methods return `405` with an `Allow` header. Error bodies use `{ "error": "message" }`. The server limits request bodies to 16 KB.

Try the API directly in a second PowerShell terminal while the backend is running:

```powershell
Invoke-RestMethod http://127.0.0.1:3001/api/health

$task = Invoke-RestMethod -Uri http://127.0.0.1:3001/api/tasks -Method Post -ContentType 'application/json' -Body '{"title":"Learn Bun"}'

Invoke-RestMethod http://127.0.0.1:3001/api/tasks

Invoke-RestMethod -Uri "http://127.0.0.1:3001/api/tasks/$($task.id)" -Method Patch -ContentType 'application/json' -Body '{"completed":true}'

Invoke-RestMethod -Uri "http://127.0.0.1:3001/api/tasks/$($task.id)" -Method Delete
```

## 7. Optional environment settings

Defaults work without `.env`. To change the backend port, create the file:

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

```sh
# macOS/Linux
cp .env.example .env
```

Edit root `.env`:

```dotenv
PORT=4001
```

Restart both servers. The frontend still opens on 5173, but the proxy forwards API calls to 4001. Production opens on 4001 too. A `PORT` value already set in your terminal environment takes precedence over `.env`.

Keep secrets on the backend. Variables prefixed with `VITE_` can be exposed to browser code. `.env` is ignored by Git; `.env.example` is safe to commit because it contains only example configuration.

## 8. Verification

```sh
bun run check
bun run build
```

Tests cover health, task creation/listing/completion/deletion, input validation, title limits, ordering, malformed JSON, missing resources, and unsupported methods. They call the API handler with real `Request` objects and inspect `Response` values without opening a server port. Each test gets a fresh store.

Type checking covers both frontend and backend. The build checks that Vite can bundle the interface. Use the quick-start interaction steps for a browser check as well.

## 9. Git workflow

Review and commit related changes after checks pass:

```sh
git status
git diff
bun run check
bun run build
git add frontend backend shared package.json bun.lock tsconfig.json .gitignore .env.example README.md
git commit -m "feat: add React TypeScript frontend and Bun task API"
git log --oneline -5
```

Use focused commits where practical: implementation and documentation can be committed separately. Stage specific files to avoid including unrelated local work. Commit source and `bun.lock`; exclude `node_modules`, `dist`, and real `.env` files. Push when you want to publish local commits to a remote.

## 10. Troubleshooting

| Problem | What to do |
| --- | --- |
| `bun` is not recognized | Reopen the terminal or add Bun's bin directory to the session PATH as shown above. |
| Dependency installation fails | Check network/registry access and retry `bun install`. |
| Port 5173 is busy | Stop the other frontend or change `server.port` in `frontend/vite.config.ts`. Strict port mode avoids silently changing the URL. |
| Port 3001 is busy | Stop the other backend or change root `.env` `PORT`, then restart both servers. |
| `API unavailable` | Start the backend, check its logs and `/api/health`, then select **Retry loading**. |
| Tasks disappeared | The backend restarted; add a database if you need persistence across restarts. |
| `Frontend build missing` | Run `bun run build` before `bun run start`. |
| Production shows old frontend code | Build again and restart; production serves generated files in `dist/frontend`. |
| Fonts look different offline | CSS uses optional Google Fonts with system fallbacks; the app still works without font downloads. |

## 11. Official references

- [React: describing the UI](https://react.dev/learn/describing-the-ui)
- [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Bun installation](https://bun.sh/docs/installation)
- [Bun runtime and script commands](https://bun.sh/docs/runtime)
- [Bun HTTP server](https://bun.com/docs/runtime/http/server)
- [Vite getting started](https://vite.dev/guide/)
- [Vite server options and proxy](https://vite.dev/config/server-options)
