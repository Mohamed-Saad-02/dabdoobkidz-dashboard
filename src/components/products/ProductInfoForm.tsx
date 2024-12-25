import { Form, Input, Select, Switch, Typography } from "antd";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";
import { Category } from "../../types/Categories";

import { useEffect, useState } from "react";
import { getBrandsLookup } from "../../api/brands";
import {
  addProductMutation,
  getProduct,
  updateProductMutation,
} from "../../api/products";
import { uploadFile } from "../../api/upload";
import { useMutateHook } from "../../hooks/useMutateHook";
import { Brand } from "../../types/Brands";
import Header from "../Header";
import Loading from "../Loading";
import SubmitSection from "../common/SubmitSection";
import openNotification from "../ui/Notfication";
import ProductCategories from "./ProductCategories";
import ImageUploadComponent from "./ProductUpload";

type ProductInfoFormProps = {
  type: "add" | "edit";
};
export default function ProductInfoForm({ type }: ProductInfoFormProps) {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [token] = useLocalStorage<string>("accessToken", "null");
  const { Title, Text } = Typography;
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [displayeedImages, setDisplayedImages] = useState([]);
  const navigate = useNavigate();
  type FieldType = {
    name: string;
    isActive: boolean;
    description: string;
    category: Category;
    subCategory: Category;
    images: string[];
    stock: number;
    status: "in-stock" | "out-of-stock";
    brand: Brand;
    price: number;
    discountType: "percentage" | "normal";
    discount?: number;
    weight?: number;
  };

  const { data: brands } = useQuery("brands", getBrandsLookup);

  const { data: product, isLoading: productFetchLoading } = useQuery(
    "product",
    () => {
      return getProduct(Number(id));
    },
    {
      enabled: type === "edit",
    }
  );

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product?.name,
        description: product?.description,
        // category: product?.category?.id,
        // subCategory: product?.subcategory?.id,
        stock: product?.stock,
        status: product?.status,
        brand: product?.brand?.id,
        price: product?.price,
        discountType: product?.discountType,
        discount: product?.discount,
        weight: product?.weight,
        isActive: product?.isActive,
      });
      console.log(product, "product?.images");

      setSelectedImages(product?.images.map((image) => ({ url: image })));
    }
  }, [product]);

  useEffect(() => {
    if (type === "add") {
      form.resetFields();
      setSelectedImages([]);
    }
  }, [type]);

  const { mutate, isLoading, isSuccess } = useMutateHook(
    "products",
    type === "add"
      ? addProductMutation(navigate)
      : updateProductMutation(Number(id), navigate)
  );

  // if (isSuccess ) {
  //   form.resetFields();
  //   // navigate("/products");
  //   setSelectedImages([]);
  // }

  const onFinish = async (values: any) => {
    setImageUploading(true);
    // setSelectedImages(prev => prev.filter(image => image?.originFileObj));

    // Separate old and new images
    const oldImages = selectedImages.filter((image) => !image?.originFileObj);
    const newImages = selectedImages.filter((image) => image?.originFileObj);

    // Upload new images
    const imagesPromise = newImages.map(async (image) => {
      if (image?.originFileObj) {
        const formData = new FormData();
        formData.append("file", image?.originFileObj);
        const imagesUrl = await uploadFile(
          image?.originFileObj,
          token,
          image?.originFileObj?.name
        );
        return imagesUrl;
      }
    });

    const newImageUrls = await Promise.all(imagesPromise).catch((error) => {
      openNotification({
        message: "Error Uploading Images",
        type: "error",
        description: "The image could be too large",
      });
    });

    // Combine old and new image URLs
    const combinedImageUrls = [
      ...oldImages.map((image) => image.url),
      ...newImageUrls,
    ];

    setImageUploading(false);
    const data = {
      name: values.name,
      description: values.description || "",
      category: values.category,
      subcategory: values.subCategory,
      status: values.status,
      brand: values.brand,
      stock: +values.stock,
      price: +values.price,
      isActive: values.isActive,
      weight: +values.weight,
      discountType: values.discountType,
      discount: +values.discount,
      images: combinedImageUrls,
    };

    mutate(data);
  };

  if (productFetchLoading && type === "edit") {
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        autoComplete="off"
        className="flex flex-col gap-6 "
      >
        <div className="bg-white p-4 rounded-[10px] ">
          <Header title="Product Information" />

          <div className="flex gap-12 p-4 mt-[22px] ">
            <div className="flex flex-col gap-4 w-[300px] ">
              <Title level={4} className=" !mb-0">
                Product Name
              </Title>
              <Text className="text-textgray">
                Do not exceed 20 characters when entering the product name.
              </Text>
            </div>
            <Form.Item<FieldType>
              name="name"
              rules={[{ required: true, message: "Please Product Name!" }]}
            >
              <Input
                placeholder="Enter Product Name"
                className="w-[600px] py-2 mx-auto"
              />
            </Form.Item>
          </div>

          <div className="flex gap-12 p-4">
            <div className="flex flex-col gap-4 w-[300px]">
              <Title level={4} className=" !mb-0">
                Description
              </Title>
              <Text className="text-textgray">
                Set a description on product to detail your product and better
                visibility
              </Text>
            </div>
            <Form.Item<FieldType>
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input a Product description",
                },
                {
                  min: 20,
                  message: "Description must be at least 20 characters",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Enter Product Name"
                className="w-[600px] h-[400px] py-2 mx-auto"
              />
            </Form.Item>
          </div>

          <ProductCategories
            categoryId={product?.category?.id}
            subCategoryId={product?.subcategory?.id}
            form={form}
          />
          <div className="flex gap-12 p-4">
            <div className="flex flex-col gap-4 w-[300px]">
              <Title level={4} className=" !mb-0">
                Brands
              </Title>
              <Text className="text-textgray">
                Please select your product brand from the list provided
              </Text>
            </div>
            <Form.Item<FieldType>
              name="brand"
              rules={[{ required: true, message: "Please Select a Brand" }]}
              className="w-[600px]"
            >
              <Select className="" placeholder="Select a Brand">
                {brands?.map((brand) => (
                  <Select.Option value={brand.id}>{brand.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="flex gap-12 p-4 mt-[22px] ">
            <div className="flex flex-col gap-4 w-[300px] ">
              <Title level={4} className=" !mb-0">
                stock
              </Title>
              <Text className="text-textgray">
                Enter the stock of the product you want to add.
              </Text>
            </div>
            <Form.Item<FieldType>
              name="stock"
              rules={[
                { required: true, message: "Please Enter Product Stock!" },
              ]}
            >
              <Input
                type="number"
                placeholder="Enter Product Stock"
                className="w-[600px] py-2 mx-auto"
              />
            </Form.Item>
          </div>
          <div className="flex gap-12 p-4 mt-[22px] ">
            <div className="flex flex-col gap-4 w-[300px] ">
              <Title level={4} className=" !mb-0">
                wieght
              </Title>
              <Text className="text-textgray">
                Enter the stock of the product you want to add.
              </Text>
            </div>
            <Form.Item<FieldType>
              name="weight"
              rules={[
                { required: true, message: "Please Enter Product weight!" },
              ]}
            >
              <Input
                type="number"
                placeholder="Enter Product Wieght"
                className="w-[600px] py-2 mx-auto"
              />
            </Form.Item>
          </div>

          <div className="flex gap-12 p-4">
            <div className="flex flex-col gap-4 w-[300px]">
              <Title level={4} className=" !mb-0">
                Status
              </Title>
              <Text className="text-textgray">
                Set the status of the product to determine whether the product
                is in stock or out of stock.
              </Text>
            </div>
            <Form.Item<FieldType>
              name="status"
              rules={[{ required: true, message: "Please Select a status" }]}
              className="w-[600px]"
            >
              <Select className="" placeholder="Select a stock option">
                <Select.Option value="in-stock">In Stock</Select.Option>
                <Select.Option value="out-of-stock">Out of Stock</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex gap-12 p-4">
            <div className="flex flex-col gap-4 w-[300px]">
              <Title level={4} className=" !mb-0">
                Active
              </Title>
              <Text className="text-textgray">
                Set a status for your product to determine whether your product
                is displayed or notF
              </Text>
            </div>
            <Form.Item<FieldType>
              name="isActive"
              rules={[{ required: true, message: "Please choose the status" }]}
            >
              <Switch className="mx-auto" />
            </Form.Item>
          </div>

          <div className="flex gap-12 p-4">
            <div className="flex flex-col gap-4 w-[300px]">
              <Title level={4} className=" !mb-0">
                Photo Product
              </Title>
              <Text className="text-textgray">
                Recommended minimum width 1080px X 1080px, with a max size of
                5MB, only *.png, *.jpg and *.jpeg image files are acceptedF
              </Text>
            </div>

            <div className="flex gap-4 ">
              <ImageUploadComponent
                type={type}
                selecedImages={selectedImages}
                setDisplayedImages={setDisplayedImages}
                setSelctedImages={setSelectedImages}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 flex flex-col gap-4">
          <Header title="Price" />
          <div className="flex gap-12 p-4 ">
            <Title level={4} className="w-[300px] !mb-0">
              Price
            </Title>
            <Form.Item<FieldType>
              name="price"
              rules={[{ required: true, message: "Please input a Price!" }]}
            >
              <Input
                placeholder="Enter Product Name"
                className="w-[600px]  py-2 mx-auto"
              />
            </Form.Item>
          </div>
          <div className="flex gap-12 p-4">
            <div className="flex flex-col gap-4 w-[300px]">
              <Title level={4} className=" !mb-0">
                Discount Type
              </Title>
              <Text className="text-textgray">
                Set your discount type. You can choose the type of discount with
                a percent or cash discount.
              </Text>
            </div>
            <Form.Item<FieldType> name="discountType" className="w-[600px]">
              <Select
                allowClear
                className=""
                placeholder="Select a discount type"
              >
                <Select.Option value="percentage">Percentage</Select.Option>
                <Select.Option value="amount">Normal</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <div className="flex gap-12 p-4 ">
            <div className="flex flex-col gap-4 w-[300px]">
              <Title level={4} className=" !mb-0">
                Set Discount
              </Title>
              <Text className="text-textgray">
                Please fill in how many discounts you will give for this
                products.
              </Text>
            </div>
            <Form.Item<FieldType>
              name="discount"
              dependencies={["discountType"]}
              rules={[
                ({ getFieldValue }) => ({
                  required: getFieldValue("discountType"),
                  message: "Please enter a discount value!",
                }),
              ]}
            >
              <Input
                placeholder="Enter Discount Value"
                className="w-[600px] py-2 mx-auto"
              />
            </Form.Item>
          </div>
        </div>
        <SubmitSection form={form} isLoading={isLoading || imageUploading} />
      </Form>
    </div>
  );
}
