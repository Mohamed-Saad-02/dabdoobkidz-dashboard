import { get, put } from "./axios";

export const getRefundRequestDetails = async (id: number) => {
  const refundRequestDetails = (await get(`/order-request/${id}`))?.data;
  return refundRequestDetails;
};

export const updateRefundRequest = async (id: number, data: any) => {
    const refundRequest = (await put(`/order-request/${id}`, data))?.data;
    return refundRequest;
}