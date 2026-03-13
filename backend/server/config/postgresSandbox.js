const { newDb } = require("pg-mem");

let client = null;
let memoryDb = null;
let seeded = false;

const createConnection = async () => {
  if (client) {
    return client;
  }

  memoryDb = newDb();
  const { Client } = memoryDb.adapters.createPg();
  client = new Client();
  await client.connect();
  return client;
};

const seedTables = async () => {
  if (seeded) {
    return;
  }

  const dbClient = await createConnection();

  await dbClient.query(`
    CREATE TABLE students (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      age INT NOT NULL,
      grade VARCHAR(5) NOT NULL
    );

    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      student_id INT NOT NULL,
      amount NUMERIC(10,2) NOT NULL,
      order_date DATE NOT NULL
    );

    CREATE TABLE employees (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      department VARCHAR(100) NOT NULL,
      salary INT NOT NULL
    );
  `);

  await dbClient.query(`
    INSERT INTO students (name, age, grade) VALUES
      ('Aarav', 20, 'A'),
      ('Meera', 21, 'B'),
      ('Rohan', 19, 'A'),
      ('Zoya', 22, 'C');

    INSERT INTO orders (student_id, amount, order_date) VALUES
      (1, 150.00, '2025-01-10'),
      (1, 250.50, '2025-01-12'),
      (2, 300.00, '2025-01-15'),
      (3, 125.75, '2025-01-20');

    INSERT INTO employees (name, department, salary) VALUES
      ('Ishita', 'Engineering', 90000),
      ('Kabir', 'Sales', 65000),
      ('Nina', 'Engineering', 105000),
      ('Dev', 'HR', 60000);
  `);

  seeded = true;
};

const validateSingleStatementQuery = (query) => {
  const trimmed = (query || "").trim();
  if (!trimmed) {
    throw new Error("Query cannot be empty.");
  }

  const statements = trimmed
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);

  if (statements.length > 1) {
    throw new Error("Only one SQL statement is allowed per execution.");
  }

  const transactionControlPattern = /\b(begin|commit|rollback|savepoint)\b/i;
  if (transactionControlPattern.test(trimmed)) {
    throw new Error("Transaction control commands are not allowed in this sandbox.");
  }
};

const runInsideSandboxRollback = async (dbClient, query) => {
  if (!memoryDb) {
    throw new Error("Sandbox database is not initialized.");
  }

  const rollbackPoint = memoryDb.backup();
  try {
    return await dbClient.query(query);
  } finally {
    rollbackPoint.restore();
  }
};

const executeSandboxQuery = async (query) => {
  validateSingleStatementQuery(query);
  const dbClient = await createConnection();
  const result = await runInsideSandboxRollback(dbClient, query);

  const columnsFromFields = Array.isArray(result.fields)
    ? result.fields.map((field) => field.name)
    : [];

  const columnsFromRows = result.rows.length > 0 ? Object.keys(result.rows[0]) : [];

  return {
    columns: columnsFromFields.length > 0 ? columnsFromFields : columnsFromRows,
    rows: result.rows,
    rowCount: result.rowCount,
  };
};

const getSandboxSchema = () => {
  return `
students(id, name, age, grade)
orders(id, student_id, amount, order_date)
employees(id, name, department, salary)
  `.trim();
};

module.exports = {
  seedTables,
  executeSandboxQuery,
  getSandboxSchema,
};