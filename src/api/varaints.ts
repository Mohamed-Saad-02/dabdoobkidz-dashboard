import { Variant } from "../types/Product";
import { del, get, post, put } from "./axios";

export const getVariants = async (productId: number) => {
  const variants = (await get<Variant[], "data">(`products/${productId}/variants`))?.data

  
  return variants;
}

export const addVaraint = async (productId: number, data: Variant) => {
  const response = (await post<Variant>(`products/${productId}/variants`, data))?.data;
  return response;
}

export const deleteVariant = async (productId: number, variantId: number) => {
  const response = await del(`/products/${productId}/variants/${variantId}`);
  return response;
}

export const updateVaraint = async (productId: number, variantId: number, data: Variant) => {
  const response = (await put<Variant>(`products/${productId}/variants/${variantId}`, data))?.data;
  return response;
}