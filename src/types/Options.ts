export type Option = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  type: string;
  order: number;
  default: string;
  productId: number;
  values: {
    id: number;
    createdAt: string;
    updatedAt: string;
    value: string;
    default: boolean;
    order: number;
  }[];
};
