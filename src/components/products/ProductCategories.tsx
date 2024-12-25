import { Form, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  getCategoriesLookup,
  getSubCategoriesLookup,
} from "../../api/categories";

export default function ProductCategories({
  categoryId,
  subCategoryId,
  form,
}: any) {
  const { Title, Text } = Typography;
  const [category, setCategory] = useState<number | undefined>();
  const { data: categories } = useQuery("categories", () => {
    return getCategoriesLookup();
  });
  const { data: SubCategories } = useQuery(["subCategories", category], () => {
    console.log(category, "categoryidforsybcategory");

    return getSubCategoriesLookup(category);
  });
  useEffect(() => {
    console.log(categoryId, "categoryId");

    if (categoryId) {
      form.setFieldsValue({
        category: categoryId,
      });
    }
    if (subCategoryId) {
      form.setFieldsValue({
        subCategory: subCategoryId,
      });
    }
  }, [categoryId, subCategoryId]);

  // console.log(category,subCategory , "categoriessection");

  return (
    <div>
      <div className="flex gap-12 p-4">
        <div className="flex flex-col gap-4 w-[300px]">
          <Title level={4} className=" !mb-0">
            Category
          </Title>
          <Text className="text-textgray">
            Do not exceed 20 characters when entering the product name.
          </Text>
        </div>
        <Form.Item
          name="category"
          rules={[{ required: true, message: "Please Select a Category" }]}
          className="w-[600px]"
        >
          <Select
            onChange={(value) => {
              form.setFieldsValue({
                subCategory: undefined,
              });
              setCategory(value);
            }}
            placeholder="Select Category"
          >
            {categories?.map((category) => (
              <Select.Option value={category.id}>{category.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div className="flex gap-12 p-4">
        <div className="flex flex-col gap-4 w-[300px]">
          <Title level={4} className=" !mb-0">
            Sub Category
          </Title>
          <Text className="text-textgray">
            Please select your product category from the list provided
          </Text>
        </div>
        <Form.Item
          name="subCategory"
          // rules={[{ required: true, message: "Please Select a Sub Category" }]}
          className="w-[600px]"
        >
          <Select
            // disabled={!form.getFieldValue("category")}
            className=""
            placeholder="Select a Sub Category"
          >
            {SubCategories?.map((subCategory) => {
              return (
                <Select.Option value={subCategory.id}>
                  {subCategory?.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </div>
    </div>
  );
}
