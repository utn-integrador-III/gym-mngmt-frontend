import { http } from "../core/http";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export function login(data: LoginRequest) {
  return http<LoginResponse>("POST", "/auth/login", data);
}
