# CipherSQL Studio

CipherSQL Studio is a full-stack web application where users can practice SQL queries by attempting assignments and executing queries in a sandbox database environment.

The project uses a **React frontend** and a **Node.js + Express backend**.
Assignments are stored in **MongoDB**, and queries are executed using **pg-mem**, which simulates a PostgreSQL database in memory.

---

# Features

* View a list of SQL assignments
* Open an assignment and read the problem statement
* Write SQL queries in a SQL editor
* Execute queries in a sandbox PostgreSQL environment
* Display query results in a table
* Generate hints for assignments using an LLM
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

* MongoDB (stores assignments and attempts)
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
├── diagrams
│   └── data-flow-diagram.jpg
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

# Data Flow Diagram

The following diagram illustrates the execution flow when a user runs a SQL query in CipherSQL Studio.

The diagram was **drawn by hand** to represent the data flow between the frontend, backend, databases, and the result display.

![Data Flow Diagram](diagrams/data-flow-diagram.jpg)

### Data Flow Explanation

1. User writes a SQL query in the SQL editor and clicks **Execute Query**.
2. React frontend sends an **API request** to the backend.
3. The **Node.js / Express backend** receives the request.
4. The backend validates and executes the SQL query using **pg-mem PostgreSQL sandbox**.
5. PostgreSQL returns the **query result or error**.
6. The backend stores the **query attempt in MongoDB**.
7. The backend sends a **JSON response** back to the frontend.
8. React updates the application state.
9. The **Result Table component** displays the query output.

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

CipherSQL Studio demonstrates a SQL learning platform built using **React, Node.js, Express, MongoDB, and pg-mem**.
The sandbox database allows safe execution of SQL queries while storing assignments and attempts.
