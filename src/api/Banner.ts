import openNotification from "../components/ui/Notfication";
import { ApiError } from "../types/ApiError";
import { Banner } from "../types/Banner";
import { del, get, post, put } from "./axios";

export const getBanners = async (params) => {
  const response = (await get<Banner[]>("/banners",params))?.data;

    
  return response;
};

export const getBannerById = async (id: number) => {
  const response = (await get<Banner>(`/banners/${id}`))?.data;
  return response;
};

export const addBanner = async (data: Banner) => {
  const response = await post<Banner>("/banners", data);
  return response;
};

export const updateBanner = async (id: number, data: Banner) => {
  const response = await put<Banner>(`/banners/${id}`, data);
  return response;
};


export const deleteBanner = async (id: number) => {
  const response = await del<Banner>(`/banners/${id}`);
  return response;
}

export const addBannerMutation = () => {
  return {
    mutationFn: (data: Banner) => {
      return addBanner(data);
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Banner Added Successfully",
        description: "Banner has been added successfully",
      });
    },
    onError: (error: ApiError) => {
      openNotification({
        type: "error",
        message: "Problem Adding Banner",
        description: error.response?.data.message || "Something went wrong",
      });
    },
  };
};


export const updateBannerMutation = (id: number) => {
  return {
    mutationFn: (data: Banner) => {
      return updateBanner(id, data);
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Banner Updated Successfully",
        description: "Banner has been updated successfully",
      });
    },
    onError: (error: ApiError) => {
      openNotification({
        type: "error",
        message: "Problem Updating Banner",
        description: error.response?.data.message || "Something went wrong",
      });
    },
  };
};
