# Task Assignee API

A backend REST API for task management with **role-based access control (RBAC)**, built using **Node.js, Express, PostgreSQL, Prisma, and JWT authentication**.

This project is designed to demonstrate **production-grade backend patterns** such as stateless authentication, strict authorization, secure data handling, and clear separation of responsibilities.

---

## Key Features

### Authentication & Authorization

- JWT-based stateless authentication
- Role-based access control with `admin` and `user` roles
- Protected routes enforced via middleware
- Tokens are validated per environment using a secret key

### User Management

- Admins can create users and other admins
- Normal users cannot create users or admins
- Passwords are hashed using bcrypt
- Email uniqueness enforced at the database level

### Task Management

- Admins can create, assign, update, and delete tasks
- Users can view all tasks
- Users can update **only tasks assigned to them**
- Task lifecycle:

  - `pending`
  - `in_progress`
  - `completed`

- Strict UUID validation for all task routes

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL (Neon)
- Prisma ORM
- JWT (jsonwebtoken)
- bcrypt
- Docker

---

## Demo Credentials

### Admin User

Email: [admin@test.com]
Password: admin123
Role: admin

### Normal User

Email: [user@test.com]
Password: user123
Role: user

---

## Admin Bootstrap Strategy

- The `/api/users` registration route is intentionally **public**.
- The controller enforces a bootstrap rule:

  - If **no admin exists**, the first user with role `admin` can be created.
  - Once an admin exists, **only authenticated admins** can create users or other admins.

- This approach allows initial system setup while preventing privilege escalation.

---

## Authentication Flow

1. Login via `/api/users/login`
2. Receive a JWT token
3. Include the token in all protected requests:

```
Authorization: Bearer <your_jwt_token>
```

JWTs are **stateless**. Server restarts do not invalidate tokens.

---

## API Endpoints

### Authentication

**POST /api/users/login**
Login and receive a JWT token.

```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

or

```json
{
  "email": "user@test.com",
  "password": "user123"
}
```

---

### Users

**POST /api/users**

- Access: Public (bootstrap) / Admin (after bootstrap)
- Description: Create a new user or admin

```json
{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "john123",
  "role": "user"
}
```

---

### Tasks

**POST /api/tasks**

- Access: Admin (Bearer Token required)
- Description: Create and assign a task to a user

```json
{
  "title": "Test Title",
  "description": "Test Description",
  "assignedTo": "cfceaac7-d32c-4785-ac06-6e3a6cfb1e02"
}
```

**GET /api/tasks**

- Access: Admin, User
- Description: Fetch all tasks

**GET /api/tasks/:taskId**

- Access: Admin, User
- Description: Fetch a single task by ID

**PUT /api/tasks/:taskId**

- Access: Admin or assigned user
- Description: Update task status or details

```json
{
  "status": "completed"
}
```

**DELETE /api/tasks/:taskId**

- Access: Admin
- Description: Delete a task

---

## Roles & Permissions

### Admin

- Create users and admins
- Create, assign, update, and delete tasks

### User

- View tasks
- Update only tasks assigned to them

---

## Validation & Error Handling

- Invalid UUID → `400 Bad Request`
- Unauthorized access → `401 Unauthorized`
- Forbidden action → `403 Forbidden`
- Resource not found → `404 Not Found`

Errors are returned in a consistent JSON format.

---

## Server Behavior

- JWT authentication is stateless
- Tokens are environment-specific
- Server restart does not invalidate tokens
- Token expiration is time-based

---

## Running Locally

```bash
npm install
npm start
```

Server runs at:

```
http://localhost:5001
```

---

## Run using Docker

```bash
docker compose up --build
```

This starts the backend service connected to PostgreSQL.

---

## Environment Variables

Create a `.env` file using the provided `.env.example`.

Required variables:

- `PORT`
- `DATABASE_URL`
- `ACCESS_TOKEN_SECRET`

---

## Design Decisions

- Stateless JWT authentication for scalability
- Prisma ORM for type-safe database access and schema consistency
- Authorization enforced at middleware and controller level
- Server-controlled ownership (`createdBy`) to prevent spoofing
- Strict validation to avoid malformed database queries
- Simplicity over over-engineering for clarity and security
