import { Order } from '../types/Order';
import { get, put } from './axios';
export const getTransactions = async(filters)=>{
    const transactions = (await get<Order[],"data">("/orders",filters))?.data
    return transactions
}


export const getTransactionDetails = async (id:number)=>{
    const transaction = (await get<Order>(`/orders/${id}`))?.data;
    return transaction
}

export const updateTransaction = async (id:number,data:any)=>{

    const transaction = (await put<Order>(`/orders/${id}`,data))?.data;
    return transaction
}

export const getRefundRequests = async (filters?:any)=>{
    const transactions = (await get("/order-request",filters))?.data
    return transactions
}