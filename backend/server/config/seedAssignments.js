const { v4: uuidv4 } = require("uuid");
const { getMongoDb } = require("./mongo");
const { getSandboxSchema } = require("./postgresSandbox");

const assignmentSeedData = [
  {
    id: uuidv4(),
    title: "Find all Engineering employees",
    description:
      "Write a query to list all employees from the Engineering department with their name and salary.",
    difficulty: "Easy",
    schema: getSandboxSchema(),
    sampleData: {
      employees: [
        { id: 1, name: "Ishita", department: "Engineering", salary: 90000 },
        { id: 2, name: "Kabir", department: "Sales", salary: 65000 },
        { id: 3, name: "Nina", department: "Engineering", salary: 105000 },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Total order amount per student",
    description:
      "Write a query to show each student_id and the total order amount. Sort by total in descending order.",
    difficulty: "Medium",
    schema: getSandboxSchema(),
    sampleData: {
      orders: [
        { id: 1, student_id: 1, amount: 150.0, order_date: "2025-01-10" },
        { id: 2, student_id: 1, amount: 250.5, order_date: "2025-01-12" },
        { id: 3, student_id: 2, amount: 300.0, order_date: "2025-01-15" },
      ],
    },
  },
  {
    id: uuidv4(),
    title: "Students with grade A",
    description:
      "Write a query to return student names and ages for students whose grade is A.",
    difficulty: "Easy",
    schema: getSandboxSchema(),
    sampleData: {
      students: [
        { id: 1, name: "Aarav", age: 20, grade: "A" },
        { id: 2, name: "Meera", age: 21, grade: "B" },
        { id: 3, name: "Rohan", age: 19, grade: "A" },
      ],
    },
  },
];

const seedAssignments = async () => {
  const db = getMongoDb();
  const assignmentsCollection = db.collection("assignments");

  const count = await assignmentsCollection.countDocuments({});
  if (count > 0) {
    return;
  }

  await assignmentsCollection.insertMany(assignmentSeedData);
};

module.exports = {
  seedAssignments,
};
