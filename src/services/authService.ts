import { http } from "../core/http";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;          
  role: string;        // "admin" | "entrenador" | "cliente"
  message: "ok";
}

export function login(data: LoginRequest) {
  return http<LoginResponse>("POST", "/auth/login", data);
}
