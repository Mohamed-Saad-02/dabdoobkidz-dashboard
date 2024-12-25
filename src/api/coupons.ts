
import openNotification from "../components/ui/Notfication";
import { ApiError } from "../types/ApiError";
import { Coupon } from "../types/Coupons";
import { del, get, post, put } from "./axios";

export const getCoupons = async (params) => {
  const coupons = (await get<Coupon[],"promocodes">("/promocodes",params))?.data;

  return coupons;
};

export const getCoupon = async (id: number) => {
  const coupon = (await get<Coupon>(`/promocodes/${id}`))?.data;
  return coupon;
}

export const editCoupon = async (id: number, coupon: Coupon) => {
  const response = (await put<Coupon>(`/promocodes/${id}`, coupon));
  return response;

}
export const addCoupon = async (coupon: Coupon) => {
  const response = (await post<Coupon>("/promocodes", coupon));
  return response;
}

export const deleteCoupon = async (id: number) => {
  const response = (await del<Coupon>(`/promocodes/${id}`));
  return response;
}

export const addCouponMutation = () => {
  return {
    mutationFn: (data: Coupon) => {
      return addCoupon(data);
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Coupon Added Successfully",
        description: "Coupon has been added successfully",
      });
    },
    onError: (error: ApiError) => {
      openNotification({
        type: "error",
        message: "Problem Adding Plan",
        description: error.response?.data.message || "Something went wrong",
      });
    },
  };
};

export const updateCouponMutation = (id: number) => {
  return {
    mutationFn: (data: Coupon) => {
      return editCoupon(id, data);
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Coupon Updated Successfully",
        description: "Coupon has been updated successfully",
      });
    },
    onError: (error: ApiError) => {
      openNotification({
        type: "error",
        message: "Problem Updating Coupon",
        description: error.response?.data.message || "Something went wrong",
      });
    },
  };
};