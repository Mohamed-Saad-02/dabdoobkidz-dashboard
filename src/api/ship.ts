import { post } from "./axios"

export const shipTransaction =async (id:number,data : any) => {
    await post(`/orders/${id}/ship`, data)
}