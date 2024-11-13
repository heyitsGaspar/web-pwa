import axios from "axios";

export const getCourses = async () => {
  const response = await axios.get("https://pwa-api-production.up.railway.app/api/courses");
  return response.data;
};
