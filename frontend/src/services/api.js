import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const fetchJobs = () => {
  return axios.get(`${API_URL}/jobs`);
};
