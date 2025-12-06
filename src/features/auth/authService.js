import api from "../../api/axios.js";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    const code = response.data.code;
    const message = response.data.message;
    if (code == 200) {
      return { success: true, message };
    } else {
      return { success: false, message };
    }
  } catch (error) {
    console.error("Login failed:", error);
    const message = error.message;
    return { success: false, message };
  }
};
