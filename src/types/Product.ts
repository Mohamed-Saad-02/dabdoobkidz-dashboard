import { Brand } from "./Brands";
import { Category } from "./Categories";
import { Option } from "./Options";

export type Product = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  discount: number;
  discountType: string;
  weight: number;
  stock: number;
  status: string;
  brand: Brand;
  category: Category;
  subcategory: {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string;
    isActive: boolean;
    images: string[];
    category: Category;
  };
  isActive: boolean;
  wishlisted: boolean;
  options: Option[];
  variants: Variant[];
};

export type Variant = {
  id: number;
  createdAt: string;
  updatedAt: string;
  sku: string;
  stock: number;
  images: string[];
  product: number;
  isActive: boolean;
  options: {
    id: number;
    createdAt: string;
    updatedAt: string;
    value: {
      id: number;
      createdAt: string;
      updatedAt: string;
      value: string;
      default: boolean;
      order: number;
    };
    option: {
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
      };
    };
  }[];
};
