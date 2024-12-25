import { User } from "../types/User";
import { get, post } from "./axios";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
export async function login(email: string, password: string) {
  const response = await post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return response?.data;
}


export async function getMe () {
  const response = (await get<User>("/profile"))?.data;
  return response;
}