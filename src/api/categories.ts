import openNotification from "../components/ui/Notfication";
import { ApiError } from "../types/ApiError";
import { Category } from "../types/Categories";
import { del, get, post, put } from "./axios";

export const getCategories = async (params) => {
  const categories = (await get<Category[], "categories">("/categories",params))?.data;
  
  return categories;
};
export const getCategoriesLookup = async () => {
  const categories = (await get<[{id:number , name : string}], "categories">("/categories",{
    lookup:true
  }))?.data
   

  return categories;
};

export const deleteCategory = async (id: number) => {
  const response = await del(`/categories/${id}`);
  return response;
}

export const getCategoryById = async (id: number) => {
  const category = (await get<Category>(`/categories/${id}`))?.data;
  return category;
};

export const addCategories = async (category: Category) => {
  const response = await post<Category>("/categories", category);
  return response;
};

export const getSubCategories = async (params) => {
  const subCategories = (await get<Category[], "categories">("/subcategories",params))
    ?.data;
  return subCategories;
};
export const getSubCategoriesLookup = async (categoryId) => {
  const subCategories = (await get<[{id:number , name : string}], "categories">("/subcategories",{lookup:true , category : categoryId}))
    ?.data
  return subCategories;
};

export const addSubCategories = async (category: Category) => {
  const response = await post<Category>("/subcategories", category);
  return response;
};

export const editCategory = async (id: number, data: Category) => {
  const response = await put<Category>(`/categories/${id}`, data);
  return response;
};


export const editSubCategories = async (id: number, data: Category) => {
  const response = await put<Category>(`/subcategories/${id}`, data);
  return response;
};

export const getSubCategoryById = async (id: number) => {
  const subCategory = (await get<Category>(`/subcategories/${id}`))?.data;
  return subCategory;

}

export const deleteSubCategory = async (id: number) => {
  const response = await del(`/subcategories/${id}`);
  return response;
};
// export const editSubCategories = async (id: number) => {};

export const addCategoryMutaion = () => {
  return {
    mutationFn: (data: Category) => {
      return addCategories(data);
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Category Added Successfully",
        description: "Category has been added successfully",
      });
    },
    onError: (error: ApiError) => {
      openNotification({
        type: "error",
        message: "Problem Adding Category",
        description: error.response?.data.errors[0]?.message || "Something went wrong",
      });
    },
  };
};

export const editCategoryMutation = (id:number) => {
  console.log("inside editCategoryMutation",id);
  
  return {
    mutationFn: ( data: Category) => {

      
      return editCategory(id, data);
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Category Edited Successfully",
        description: "Category has been edited successfully",
      });
    },
    onError: (error: ApiError) => {
      openNotification({
        type: "error",
        message: "Problem Editing Category",
        description: error.response?.data.message || "Something went wrong",
      });
    },
  };
};


export const addSubCategoryMutation = () => {
  return {
    mutationFn: (data: Category) => {
      return addSubCategories(data);
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "SubCategory Added Successfully",
        description: "SubCategory has been added successfully",
      });
    },
    onError: (error: ApiError) => {
      openNotification({
        type: "error",
        message: "Problem Adding SubCategory",
        description: error.response?.data.errors[0]?.message || "Something went wrong",
      });
    },
  };
};

export const editSubCategoryMutation = (id:number) => {
  return {
    mutationFn: (data: Category) => {
      return editSubCategories(id, data);
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "SubCategory Edited Successfully",
        description: "SubCategory has been edited successfully",
      });
    },
    onError: (error: ApiError) => {
      openNotification({
        type: "error",
        message: "Problem Editing SubCategory",
        description: error.response?.data.errors[0]?.message || "Something went wrong",
      });
    },
  };
};