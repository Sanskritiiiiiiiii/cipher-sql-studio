const { getMongoDb } = require("./mongo");
const { getSandboxSchema } = require("./postgresSandbox");

const schema = getSandboxSchema();

const assignmentSeedData = [
  {
    id: "assignment_1",
    title: "Find Engineering employees",
    description: "Find employees from the Engineering department.",
    difficulty: "Easy",
    schema,
    sampleData: {
      employees: [
        { id: 1, name: "Ishita", department: "Engineering", salary: 90000 },
        { id: 2, name: "Kabir", department: "Sales", salary: 65000 },
        { id: 3, name: "Nina", department: "Engineering", salary: 105000 },
      ],
    },
  },
  {
    id: "assignment_2",
    title: "Total order amount per student",
    description: "Show each student_id and the total order amount.",
    difficulty: "Medium",
    schema,
    sampleData: {
      orders: [
        { id: 1, student_id: 1, amount: 150.0, order_date: "2025-01-10" },
        { id: 2, student_id: 1, amount: 250.5, order_date: "2025-01-12" },
        { id: 3, student_id: 2, amount: 300.0, order_date: "2025-01-15" },
      ],
    },
  },
  {
    id: "assignment_3",
    title: "Students with grade A",
    description: "Find students who have grade A.",
    difficulty: "Easy",
    schema,
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
  if (count > 0) return;

  await assignmentsCollection.insertMany(assignmentSeedData);
};

module.exports = {
  seedAssignments,
};