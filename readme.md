# Task Assignee API

A backend REST API for task management with **role-based access control (RBAC)**, built using **Node.js, Express, MongoDB, and JWT authentication**.
This project is intentionally designed to reflect **production-grade backend patterns** such as stateless authentication, strict authorization, and secure data handling.

---

## Key Features

### Authentication & Authorization

- JWT-based stateless authentication
- Role-based access control with `admin` and `user` roles
- Protected routes using middleware
- Tokens are validated per environment (no shared secrets)

### User Management

- Admins can create users and other admins
- Normal users cannot create users or admins
- Passwords are hashed using bcrypt
- Email uniqueness enforced at the database level

### Task Management

- Admins can create, assign, update, and delete tasks
- Users can view tasks
- Users can update **only tasks assigned to them**
- Task lifecycle: `pending → in_progress → completed`
- Strict ObjectId validation for all task routes

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs

---

## Demo Credentials (For Evaluation)

> These credentials assume the users already exist in the database.

### Admin User

Email: [admin@test.com]
Password: admin123
Role: admin

### Normal User

Email: [user@test.com]
Password: user123
Role: user

---

## Admin Creation Strategy

- The **first admin** is created manually (or seeded) to bootstrap the system.
- Once an admin exists, **only admins** can create additional users or admins via the API.
- This design prevents unauthorized privilege escalation and mirrors real-world RBAC systems.

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

---

### Users (Admin Only)

**POST /api/users**
Create a new user or admin.

---

### Tasks

**POST /api/tasks**

- Access: Admin
- Description: Create and assign a task to a user

**GET /api/tasks**

- Access: Admin, User
- Description: Fetch all tasks

**GET /api/tasks/:taskId**

- Access: Admin, User
- Description: Fetch a single task by ID

**PUT /api/tasks/:taskId**

- Access: Admin or assigned user
- Description: Update task status or details

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

- Invalid ObjectId → `400 Bad Request`
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

## Environment Variables

Create a `.env` file using the provided `.env.example`.

Required variables:

- `PORT`
- `MONGO_URI`
- `ACCESS_TOKEN_SECRET`

---

## Design Decisions

- Stateless JWT authentication for scalability
- Authorization enforced at middleware and controller level
- Server-controlled ownership (`createdBy`) to prevent spoofing
- Strict validation to avoid malformed database queries
- Simplicity over over-engineering for clarity and security

---
