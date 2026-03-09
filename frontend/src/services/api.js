import axios from "axios";

const API_BASE = "http://localhost:8002/api";

export const getAssignments = async () => {
  const response = await axios.get(`${API_BASE}/assignments`);
  return response.data;
};

export const getAssignmentById = async (assignmentId) => {
  const response = await axios.get(`${API_BASE}/assignments/${assignmentId}`);
  return response.data;
};

export const executeQuery = async ({ assignmentId, query }) => {
  const response = await axios.post(`${API_BASE}/execute`, {
    assignmentId,
    query,
  });
  return response.data;
};

export const getHint = async ({ assignmentId, query }) => {
  const response = await axios.post(`${API_BASE}/hint`, {
    assignmentId,
    query,
  });
  return response.data;
};