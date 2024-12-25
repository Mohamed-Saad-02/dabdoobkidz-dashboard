import { del, get, post, put } from "./axios";

export const getTestmonials: any = async (params?: any) => {
  const testmonials = (await get("/testimonials", params))?.data;

  return testmonials;
};


export const addTestmonials: any = async (data: any) => {
  const testmonials = (await post("/testimonials", data))?.data;
  return testmonials;
}

export const deleteTestmonials: any = async (id: string) => {
  const testmonials = (await del(`/testimonials/${id}`))?.data;
  return testmonials;
}
export const updateTestmonials: any = async (id: string, data: any) => {
  const testmonials = (await put(`/testimonials/${id}`, data))?.data;
  return testmonials;
}
export const getTestmonialsById: any = async (id: string) => {
  const testmonials = (await get(`/testimonials/${id}`))?.data;
  return testmonials;
}