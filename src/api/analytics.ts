import { get } from "./axios"

export const getAnalytics :any = async (params?: any) => {
    const analytics = (await get("/analytics", params))?.data;

    
    return analytics;
}