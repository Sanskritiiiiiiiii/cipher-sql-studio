const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateHint = async ({ assignment, query }) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are helping a student learn SQL.

Assignment: ${assignment.title}

Description:
${assignment.description}

Student Query:
${query}

Give ONLY a hint to guide the student.
Do NOT give the full SQL solution.
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return response;
};

module.exports = {
  generateHint,
};