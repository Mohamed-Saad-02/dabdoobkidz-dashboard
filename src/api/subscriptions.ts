import { get } from "./axios";

export const getSubscriptions = async (filterParams?:any) => {
  const subscriptions = (await get<any>("/subscriptions",filterParams))?.data;
  return subscriptions;
};
