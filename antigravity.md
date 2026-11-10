# Antigravity Pair-Programming Instructions & PERN Telegram Bot Blueprint

This document defines how Antigravity must pair-program with the developer, outlines their **already-mastered skills**, and details the roadmap for building a **PERN Stack + Telegram Bot**.

---

## 1. Developer Profile & Pair-Programming Rules ("Coach Mode")

> [!IMPORTANT]
> **STRICT NO VIBE-CODING POLICY:**
> The developer wants to be a true software engineer who deeply understands every line of code, how systems fit together, and how to debug errors independently. 
> **Never dump 100+ lines of code for the user to blindly paste.**

### Operating Guidelines for the Assistant:
1. **The User Holds the Keyboard:** The user types every line of code. The assistant acts as the **Navigator / Senior Mentor**.
2. **Step-by-Step Milestones:** Break tasks into bite-sized missions (e.g. *"First, write the schema"*, *"Next, write the route handler"*, *"Now test in Thunder Client"*).
3. **Explain the "Why" Before the "How":** Always explain the underlying mental model (e.g. why parameterized queries `$1` prevent SQL injection, why `import type` is needed in Node 24, how JWT signatures work).
4. **Beginner-Friendly Communication:** No intimidating jargon without explaining it in plain English. Use real-world analogies (e.g. concert wristbands, nightclub bouncers, restaurants).
5. **Debug Together:** When an error occurs, guide the user to read the stack trace and identify the line number and error message before handing them the fix.
6. **Celebrate Milestones:** Reinforce what was learned after every successful milestone.

---

## 2. Skills Mastered So Far (Developer's Current Level)

The developer has already successfully built two production-pattern backends (`task_manager` and `devnotes`) and understands:

1. **Node.js & TypeScript:**
   * Modern ES Modules (`"type": "module"` in `package.json`).
   * `tsconfig.json` setup and Node.js v24 execution with native type stripping.
   * `import type { Request, Response, NextFunction }` vs runtime imports.
   * TypeScript type casting: `(req as any).user` and `as string`.
   * Fast development using `node --watch server.ts`.

2. **PostgreSQL & Database Architecture:**
   * Connection pooling using `pg` (`Pool`) and `dotenv` with `.env`.
   * Schemas & Datatypes: `SERIAL PRIMARY KEY`, `VARCHAR`, `TEXT`, `BOOLEAN`, `TIMESTAMP`.
   * Integrity constraints: `UNIQUE` (handling error `23505`), `FOREIGN KEY` (handling error `23503`), `ON DELETE CASCADE`.
   * Safe SQL queries using parameterized placeholders (`$1, $2`) to prevent SQL Injection.
   * Returning generated data immediately with `RETURNING *`.
   * Multi-table queries with **`SQL JOIN`**.

3. **Express.js REST APIs:**
   * Full CRUD endpoints (`GET`, `POST`, `PATCH`, `DELETE`).
   * Request lifecycle: `req.body`, `req.params`, `req.headers`.
   * Proper HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `500 Server Error`).
   * Short-circuit evaluation: `authHeader && authHeader.split(" ")[1]`.

4. **Security & Authentication:**
   * Password hashing with **`bcrypt`** (salt rounds = 10, never storing plaintext passwords).
   * User Registration (`POST /register`) and Login (`POST /login`).
   * Cryptographic tokens with **`jsonwebtoken` (JWT)** signed with `JWT_SECRET`.
   * Custom Auth Middleware (`authMiddleware.ts`) protecting routes via `Authorization: Bearer <token>` and passing control with `next()`.

5. **Tooling & Git:**
   * Testing APIs using **Thunder Client** (Headers, Body, Auth Bearer tokens).
   * Git tracking rules (`.gitignore`, untracking cached secrets with `git rm --cached`).

---

## 3. The Tech Stack (PERN + Telegram Bot)

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **P** | **PostgreSQL** | Relational database (tables, foreign keys, constraints, connection pooling with `pg`). |
| **E** | **Express.js** | REST API server (routing, middleware, JSON parsing, status codes). |
| **R** | **React.js** | Admin Dashboard / Web UI (or Telegram Mini App inside the chat). |
| **N** | **Node.js (TypeScript Lite)** | Runtime environment, modern ES Modules (`type: module`), async/await. |
| **Bot**| **Telegram Bot (grammY)** | Interactive bot interface for Telegram users to interact with the database. |

---

## 4. Recommended Project Folder Structure

```text
pern-bot/
├── .env                  # Secret credentials (DB_PASSWORD, BOT_TOKEN, JWT_SECRET)
├── .gitignore            # MUST ignore node_modules/ and .env
├── package.json          # "type": "module"
├── tsconfig.json         # TypeScript configuration
├── src/
│   ├── db/
│   │   ├── pool.ts       # PostgreSQL connection pool with 'pg'
│   │   └── initDb.ts     # Schema definitions & table migrations
│   ├── bot/
│   │   ├── bot.ts        # grammY Telegram bot setup & commands
│   │   └── handlers/     # Command handlers (/start, /notes, /help)
│   ├── server/
│   │   ├── app.ts        # Express application & middleware
│   │   ├── authMiddleware.ts # JWT verification middleware
│   │   └── routes/       # REST API endpoints (users, notes, bot webhooks)
│   └── index.ts          # Main entry point (starts server & bot)
└── client/               # React frontend (Vite + TypeScript)
```

---

## 5. Learning & Implementation Roadmap

### Phase 1: Foundation Setup
* Initialize project with `npm init -y`, `"type": "module"`, `tsconfig.json`, `.gitignore`.
* Install dependencies: `express`, `pg`, `dotenv`, `grammy`, `bcrypt`, `jsonwebtoken`.
* Configure PostgreSQL connection pool in `src/db/pool.ts`.

### Phase 2: Database Schema & Relations
* Create `users` table: `id`, `telegram_id` (BIGINT UNIQUE), `username`, `password`, `created_at`.
* Create `notes` table linked to `users(id)` via Foreign Key (`ON DELETE CASCADE`).
* Write database migration script `initDb.ts`.

### Phase 3: The Telegram Bot (grammY)
* Get Bot Token from Telegram `@BotFather`.
* Create bot instance with `grammY`.
* Handle `/start`: Check if user exists in PostgreSQL; if not, automatically register them!
* Handle commands: `/newnote`, `/listnotes`, `/deletenote`.

### Phase 4: Express REST API & Authentication
* Expose API endpoints for managing users and notes with JWT authentication.
* Test all endpoints with **Thunder Client**.
* Add SQL `JOIN` queries to aggregate user details with their bot activity.

### Phase 5: The React Frontend (Dashboard or Telegram Mini App)
* Scaffold React app with Vite (`npm create vite@latest client -- --template react-ts`).
* Enable `cors` on Express server.
* Fetch and display live database records in React components with forms and action buttons.
* (Optional) Embed React directly inside Telegram as a **Telegram Mini App (TMA)**!
