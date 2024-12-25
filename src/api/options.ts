import { Option } from "../types/Options";
import { del, get, post, put } from "./axios";

export const addOption = async (data: Option, productId: number) => {
  const option = (await post<Option>(`/products/${productId}/options`, data))?.data;
  return option;
};


export const getOptions = async (productId:number) => {
  const options = (await get<Option[], "data">(`products/${productId}/options`))?.data;

  
  return options;
}

export const deleteOption = async (productId: number, optionId: number) => {
  const response = await del(`/products/${productId}/options/${optionId}`);
  return response;
}

export const getOptionById = async (productId: number, optionId: number) => {
  const option = (await get<Option>(`/products/${productId}/options/${optionId}`))?.data;
  return option;
}

export const updateOption = async (productId: number, optionId: number, data: Option) => {
  const option = (await put<Option>(`/products/${productId}/options/${optionId}`, data))?.data;
  return option;
}