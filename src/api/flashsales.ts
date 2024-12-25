import { FlashSale } from '../types/flashsale';
import { del, get, post, put } from './axios';
export const getFlashsales = async (filterParams?:any) => {
  const flashsales = (await get<FlashSale[], 'flashsales'>('/flash-sale',filterParams))?.data;
  return flashsales;
}
export const getFlashsale = async (id: number) => {
  const flashsale = (await get<FlashSale>(`/flash-sale/${id}`))?.data;
  return flashsale;
}

export const createFlashsale = async (data: any) => {
  const flashsale = (await post<FlashSale>(`/flash-sale`, data))?.data;
  return flashsale;
}


export const deleteFlashSale = async (id: number) => {
  const flashsale = (await del<FlashSale>(`/flash-sale/${id}`))?.data;
  return flashsale;
}

export const updateFlashSale = async (id: number, data: any) => {
  const flashsale = (await put(`/flash-sale/${id}`, data))?.data;
  return flashsale;
}