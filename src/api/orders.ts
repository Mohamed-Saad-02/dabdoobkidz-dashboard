import { get } from "./axios";

export const getWalletHistory = async (id: number) => {
    const walletHistory = (await get(`/users/${id}/wallet/history`))?.data;
    return walletHistory;
}

export const getUserOrdersHistory = async (id: number) => {
    const orders = (await get(`/profile/orders/${id}`))?.data;
    return orders;
}
