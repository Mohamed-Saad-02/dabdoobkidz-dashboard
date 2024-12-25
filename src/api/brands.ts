import openNotification from "../components/ui/Notfication"
import { ApiError } from "../types/ApiError"
import { Brand } from "../types/Brands"
import { get, post, put, delet, del } from "./axios"

export const getBrands = async(filterParams?:any) => {
    const brands =  (await get<Brand[],"brands">("/brands",filterParams))?.data.brands
    return brands
}

export const getBrandsLookup = async () => {
    const brandsLookup = (await get<[{id:number , name : string}]>("/brands",{
        lookup:true
    }))?.data;

    return brandsLookup;
}
export const getBrand = async(id:number) => {
    const brand =  (await get<Brand>(`/brands/${id}`))?.data
    return brand
}
export const addBrand = async(data:Brand) => {
    const brand =  (await post<Brand>(`/brands`,data))?.data
    return brand
}

export const updateBrand = async(id:number,data:Brand) => {
    const brand =  (await put<Brand>(`/brands/${id}`,data))?.data
    return brand
}

export const deleteBrand = async(id:number) => {
    const brand =  (await del<Brand>(`/brands/${id}`))?.data
    return brand

}

export const addBrandMutation = ()=>{
    return {
        mutationFn:(data:Brand)=>{
            return addBrand(data)
        },
        onSuccess:()=>{
            openNotification({
                type:"success",
                message:"Brand Added Successfully",
                description:"Brand has been added successfully"
            })
        },
        onError:(error:ApiError)=>{
            openNotification({
                type:"error",
                message:"Problem Adding Brand",
                description:error.response?.data.message || "Something went wrong"
            })
        }
    }
}


export const updateBrandMutation = (id:number)=>{
    return {
        mutationFn:(data:Brand)=>{
            return updateBrand(id,data)
        },
        onSuccess:()=>{
            openNotification({
                type:"success",
                message:"Brand Updated Successfully",
                description:"Brand has been updated successfully"
            })
        },
        onError:(error:ApiError)=>{
            openNotification({
                type:"error",
                message:"Problem Updating Brand",
                description:error.response?.data.message || "Something went wrong"
            })
        }
    }
}