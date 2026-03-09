# CipherSQL Studio

CipherSQL Studio is a full-stack web application where users can practice SQL queries by attempting assignments and executing queries in a sandbox database environment.

The project uses a **React frontend** and a **Node.js + Express backend**.
Assignments are stored in **MongoDB**, and queries are executed using **pg-mem**, which simulates a PostgreSQL database in memory.

---

# Features

* View a list of SQL assignments
* Open an assignment and read the problem statement
* Write SQL queries in an editor
* Execute queries in a sandbox PostgreSQL environment
* Display query results in a table
* Generate hints for assignments
* Store assignment attempts

---

# Tech Stack

## Frontend

* React
* React Router
* SCSS

## Backend

* Node.js
* Express

## Databases

* MongoDB (stores assignments)
* pg-mem (in-memory PostgreSQL sandbox)

## Other Libraries

* axios
* cors
* dotenv
* uuid

---

# Project Structure

```
cipher-sql-studio
│
├── backend
│   ├── node_modules
│   │
│   ├── server
│   │   ├── config
│   │   │   ├── mongo.js
│   │   │   ├── postgresSandbox.js
│   │   │   └── seedAssignments.js
│   │   │
│   │   ├── controllers
│   │   │   ├── assignmentsController.js
│   │   │   ├── executeQueryController.js
│   │   │   ├── hintController.js
│   │   │   └── hint_worker.py
│   │   │
│   │   ├── routes
│   │   │   ├── assignments.js
│   │   │   ├── executeQuery.js
│   │   │   └── hint.js
│   │   │
│   │   ├── utils
│   │   │   └── hintClient.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── frontend
│   ├── node_modules
│   │
│   ├── public
│   │   └── index.html
│   │
│   ├── src
│   │   ├── components
│   │   │   ├── AssignmentCard.jsx
│   │   │   ├── HintBox.jsx
│   │   │   ├── ResultTable.jsx
│   │   │   └── SQLEditor.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── AssignmentAttempt.jsx
│   │   │   └── AssignmentList.jsx
│   │   │
│   │   ├── services
│   │   │   └── api.js
│   │   │
│   │   ├── styles
│   │   │   ├── _mixins.scss
│   │   │   ├── _variables.scss
│   │   │   └── main.scss
│   │   │
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

---

# How the Application Works

1. The frontend requests assignments from the backend API.
2. Assignments are stored in MongoDB.
3. When a user writes and runs a SQL query, the query is sent to the backend.
4. The backend executes the query using **pg-mem**, which simulates a PostgreSQL database.
5. The result is returned to the frontend and displayed in a table.
6. Users can also request hints for assignments.

---

# Data Flow

User → Frontend → Backend API → PostgreSQL Sandbox → Backend → Frontend → User

Steps:

1. User selects an assignment.
2. User writes a SQL query.
3. Query is sent to backend API.
4. Backend executes query using pg-mem.
5. Results are returned and displayed.

---

# Setup Instructions

## 1. Clone the Repository

```
git clone <repository-link>
cd cipher-sql-studio
```

---

# Backend Setup

Move to backend folder:

```
cd backend
```

Install dependencies:

```
npm install
```

Create `.env` file inside backend:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start backend server:

```
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

# Frontend Setup

Open another terminal:

```
cd frontend
```

Install dependencies:

```
npm install
```

Start frontend:

```
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

# API Endpoints

## Get Assignments

```
GET /api/assignments
```

Returns list of available SQL assignments.

---

## Get Assignment by ID

```
GET /api/assignments/:id
```

Returns details of a specific assignment.

---

## Execute SQL Query

```
POST /api/run-query
```

Executes a SQL query in the sandbox database.

---

## Get Hint

```
POST /api/hint
```

Returns a hint for the assignment.

---

# Possible Improvements

* Add authentication system
* Save user query history
* Add more SQL assignments
* Improve UI for displaying results
* Add query validation

---

# Conclusion

This project demonstrates a simple SQL practice platform built using **React, Node.js, Express, MongoDB, and pg-mem**. The sandbox database allows safe execution of SQL queries while storing assignments and attempts.
