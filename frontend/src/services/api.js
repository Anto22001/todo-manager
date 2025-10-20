import axios from "axios";
import store from "./store";
import { logout } from "./authSlice";

const API = axios.create({ baseURL: `${import.meta.env.VITE_BACKEND_API}/api` });
API.interceptors.request.use((req) => {
  const token = store.getState().auth.token;
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message;
    if (typeof errorMessage === "string") {
      const lowerCaseMessage = errorMessage.toLowerCase();
      if (lowerCaseMessage.includes("token")) {
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export const login = (email, password) => API.post("/login", {email, password});
export const register = (name, surname, email, password) => API.post("/register", {name, surname, email, password});

export const createTodo = (data) => API.post("/todo", data);
export const updateTodo = (id, data) => API.put(`/todo/${id}`, data);
export const deleteTodo = (id) => API.delete(`/todo/${id}`);
export const getTodo = (id) => API.get(`/todo/${id}`);

export const getAllTodos = () => API.get(`/todos`);
export const toggleTodosCompletion = (data) => API.put(`/todos/toggle-completion`, data);
export const deleteTodos = (ids) => API.delete(`/todos`, {data: ids});

export const getAllCategories = () => API.get(`/categories`);
export const getCategory = (id) => API.get(`/category/${id}`);

export const getAnalytics = () => API.get(`/analytics`);