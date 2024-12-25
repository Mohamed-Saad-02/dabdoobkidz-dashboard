import { get, post } from "./axios";

export const getUserRoles = async () => {
    const userRoles = await get<any>("/roles");
    return userRoles;
}

export const createUser = async (data: any) => {
    const user = (await post<any>("/users", data))?.data;
    return user;
}