import openNotification from "../components/ui/Notfication";
import { ApiError } from "../types/ApiError";
import { Product } from "../types/Product";
import { del, get, post, put } from "./axios";

export const getProducts = async (params?) => {
  const products = (await get<Product[], "products">("/products",params))?.data

  return products;
};

export const getProduct = async (id: number) => {
  const product = (await get<Product>(`/products/${id}`))?.data;

  return product;
};

export const addProduct = async (data: Product) => {
  return await post(`/products`, data);
};

export const updateProduct = async (id: number, data: Product) => {
  return await put(`/products/${id}`, data);
};

export const deleteProduct = async (id: number) => {
  return await del(`/products/${id}`);
};
export const addProductMutation = (navigate:any) => {
  return {
    mutationFn: (data: Product) => {
      return addProduct(data);
    },
    onSuccess: (response) => {
      console.log(response, "responsefrom creating product");
      

      openNotification({
        type: "success",
        message: "Product Added Successfully",
        description: "Product has been added successfully",
      });
      navigate(`/product/${response.data.id}?tab=2`);
    },
    onError: (error: any) => {
      openNotification({
        type: "error",
        message: "Problem Adding Product",
        description: error.response?.data?.errors[0]?.message || "Something went wrong",
      });
    },
  };
};

export const updateProductMutation = (id: number,navigate:any) => {
  return {
    mutationFn: (data: Product) => {
      return updateProduct(id, data);
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Product Updated Successfully",
        description: "Product has been updated successfully",
      });
      navigate(`/products`);
    },
    onError: (error: ApiError) => {
      openNotification({
        type: "error",
        message: "Problem Updating Product",
        description: error.response?.data.message || "Something went wrong",
      });
    },
  };
};
