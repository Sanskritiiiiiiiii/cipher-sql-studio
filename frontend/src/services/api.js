import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

export const getAssignments = async () => {
  const response = await apiClient.get("/assignments");
  return response.data;
};

export const getAssignmentById = async (assignmentId) => {
  const response = await apiClient.get(`/assignments/${assignmentId}`);
  return response.data;
};

export const executeQuery = async ({ assignmentId, query }) => {
  const response = await apiClient.post("/execute", { assignmentId, query });
  return response.data;
};

export const getHint = async ({ assignmentId, query }) => {
  const response = await apiClient.post("/hint", { assignmentId, query });
  return response.data;
};

export const saveHistory = async ({ assignmentId, queryText, executionStatus }) => {
  const response = await apiClient.post("/history", {
    assignmentId,
    queryText,
    executionStatus,
  });
  return response.data;
};

export const getHistoryByAssignment = async (assignmentId) => {
  const response = await apiClient.get(`/history/${assignmentId}`);
  return response.data;
};
