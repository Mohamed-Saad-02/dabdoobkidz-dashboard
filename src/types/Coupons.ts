import { Category } from "./Categories";

export type Coupon = {
  id: number;
  createdAt: string;
  updatedAt: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxUsageNumber: number;
  maxAmount: number;
  startDate: string;
  endDate: string;
  userType: string;
  category: Category;
};
