// Student login for the website (same accounts as the rest of EduMerit —
// edumerit_customers, via /api/auth/*). Keeps the JWT in localStorage so a
// student stays signed in across mock test pages.

import { API_BASE } from "./mockTestApi";

const TOKEN_KEY = "edumerit_student_token";
const USER_KEY = "edumerit_student_user";

const safe = (fn, fallback = null) => {
  try { return fn(); } catch { return fallback; }
};

export const getToken = () => (typeof window === "undefined" ? null : safe(() => localStorage.getItem(TOKEN_KEY)));
export const getStudent = () =>
  typeof window === "undefined" ? null : safe(() => JSON.parse(localStorage.getItem(USER_KEY) || "null"));

const save = (token, user) => {
  safe(() => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  });
  window.dispatchEvent(new Event("edumerit-auth"));
};

export const logout = () => {
  safe(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  });
  window.dispatchEvent(new Event("edumerit-auth"));
};

const post = async (path, body) => {
  const res = await fetch(`${API_BASE}/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
};

export async function login(email, password) {
  const d = await post("login", { email, password });
  save(d.token, d.user);
  return d.user;
}

export async function register({ name, email, phone, password }) {
  const d = await post("register", { name, email, phone, password });
  save(d.token, d.user);
  return d.user;
}

// Authenticated fetch against the API. Logs the student out on 401.
export async function authFetch(path, { method = "GET", body } = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    logout();
    const err = new Error("Please log in again.");
    err.status = 401;
    throw err;
  }
  if (!res.ok || data.success === false) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}
