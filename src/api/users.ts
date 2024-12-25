import { Address } from "../types/Address";
import { Order } from "../types/Order";
import { User } from "../types/User";
import { del, get, patch, post, put } from "./axios";

export const getUsers = async (filterParams?) => {
  const users = (await get<User[]>("/users", filterParams))?.data;


  return users;
};

export const getAddresses = async () => {
  const addresses = await get<Address>("/addresses");
  return addresses;
};

export const getUserId = async (id: number) => {
  const user = (await get<User>(`/users/${id}`))?.data;
  return user;
};

export const updateProfile = async (id: number | undefined, data: User) => {
  const user = (await put<User>(`/users/${id}`, data))?.data;
  return user;
};

export const getUserOrders = async (id: number) => {


  const orders = (await get<Order[], "data">(`/profile/orders/${id}`))?.data;
 
  

  return orders;
  // return orders;
};

export const createUser = async (data: User) => {
  const user = (await post<User>("/users", data))?.data;
  return user;
};



export const deleteUser = async (id: number) => {
  const user = (await del<User>(`/users/${id}`))?.data;
  return user;
}

export const toggleUserStatus = async (id: number,isActive:boolean) => {
  const user = (await patch<User>(`/users/${id}/status` , isActive))?.data;
  return user;
}