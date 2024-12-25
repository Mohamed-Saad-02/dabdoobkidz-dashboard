import openNotification from "../components/ui/Notfication";
import { ApiError } from "../types/ApiError";
import { Plan } from "../types/Plan";
import { del, get, post, put } from "./axios";

export const getPlans = async (params) => {
  const plans = (await get<Plan[] , "plans">("/plans",params))?.data;
  return plans;
};
export const getPlan = async (id: number) => {
  const plan = (await get<Plan>(`/plans/${id}`))?.data;
  return plan;
};
export const addPlan = async (data: Plan) => {
  const plan = (await post<Plan>(`/plans`, data))?.data;
  return plan;
};

export const updatePlan = async (id: number, data: Plan) => {
  const plan = (await put<Plan>(`/plans/${id}`, data))?.data;
  return plan;
};

export const deletePlan = async (id: number) => {
  const plan = (await del<Plan>(`/plans/${id}`))?.data;
  return plan;
};

export const addPlanMutation = () => {
  return {
    mutationFn: (data: Plan) => {
      return addPlan(data);
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Plan Added Successfully",
        description: "Plan has been added successfully",
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

export const updatePlanMutation = (id: number) => {
  return {
    mutationFn: (data: Plan) => {
      return updatePlan(id, data);
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Plan Updated Successfully",
        description: "Plan has been updated successfully",
      });
    },
    onError: (error: ApiError) => {
      openNotification({
        type: "error",
        message: "Problem Updating Plan",
        description: error.response?.data.message || "Something went wrong",
      });
    },
  };
};
