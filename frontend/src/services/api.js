import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const fetchJobs = () => {
  return axios.get(`${API_URL}/jobs`);
};
