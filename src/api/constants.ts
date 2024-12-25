import { get } from "./axios";

export const getCities = async () => {
  const cities = (await get("/city"))?.data;
  return cities;
};


export const getGovernorates = async () => {
    const governorates = (await get("/governorate"))?.data;
    return governorates;
}