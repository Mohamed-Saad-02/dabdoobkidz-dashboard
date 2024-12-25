import type { FormProps } from "antd";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Typography,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import { useQuery } from "react-query";
import { getCategoriesLookup } from "../../api/categories";
import Header from "../Header";

import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addCouponMutation,
  getCoupon,
  updateCouponMutation,
} from "../../api/coupons";
import { useMutateHook } from "../../hooks/useMutateHook";
import SubmitSection from "../common/SubmitSection";

type CouponFormProps = {
  type: "add" | "edit";
};

export default function CouponForm({ type }: CouponFormProps) {
  const { id } = useParams<{ id: string }>();
  const { Title, Text } = Typography;
  const [form] = Form.useForm();

  const { data: categories } = useQuery("categories", getCategoriesLookup);
  console.log(categories, "categories from coupon form");

  type FieldType = {
    code: string;
    category: string;
    remember: string;
    discountType: string;
    discountValue: number;
    maxUsageNumber: number;
    expirationDate: string;
    startDate: string;
    maxAmount: number;
    userType: "normal" | "premium";
  };
  const { data: coupon } = useQuery(
    "coupon",
    () => {
      return getCoupon(Number(id));
    },
    {
      enabled: type === "edit",
    }
  );

  // const [image, setImage] = useState<string | undefined>();
  const { mutate, isLoading, isSuccess } = useMutateHook(
    "coupon",
    type === "add" ? addCouponMutation() : updateCouponMutation(Number(id))
  );
  const navigate = useNavigate();

  if (isSuccess) {
    form.resetFields();
    navigate("/coupons");
  }
  useEffect(() => {
    console.log(coupon, "copoun");

    if (coupon) {
      form.setFieldsValue({
        code: coupon?.code,
        category: coupon?.category?.id,
        couponType: coupon?.discountType,
        discountValue: coupon?.discountValue,
        maxUsageNumber: coupon?.maxUsageNumber,
        maxAmount: coupon?.maxAmount,
        discountType: coupon?.discountType,
        startDate: moment(coupon?.startDate),
        expirationDate: moment(coupon?.endDate),
        userType: coupon?.userType,
      });
    }
  }, [coupon]);

  useEffect(() => {
    if (type === "add") {
      form.resetFields();
    }
  }, [type]);
  const [startDate, setStartDate] = useState<string | string[]>(
    coupon?.startDate
  );
  const [endDate, setEndDate] = useState<string | string[]>(coupon?.endDate);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log(values.category, "selected categories from coupon");

    const data = {
      code: values.code,
      categories: values.category,
      discountType: values.discountType,
      discountValue: values.discountValue,
      maxUsageNumber: values.maxUsageNumber,
      maxAmount: values.maxAmount,
      userType: values.userType,
      startDate: startDate,
      endDate: endDate,
      image: "https://via.placeholder.com/150",
    };

    mutate(data);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white p-4  flex flex-col gap-4 rounded-[10px]">
        <Header title="Add Coupons" />
        <Form form={form} onFinish={onFinish} layout="vertical">
          <div className="flex gap-4 w-full  ">
            <Form.Item<FieldType>
              className="w-full"
              label="Coupon Code"
              name="code"
              rules={[
                { required: true, message: "Please input your Coupon Code!" },
              ]}
            >
              <Input className="py-2" placeholder="Enter Coupon Code" />
            </Form.Item>
            <Form.Item<FieldType>
              rules={[{ required: true, message: "Please select a category" }]}
              className="w-full "
              label="Select Category"
              name="category"
            >
              <Select
                mode="multiple"
                className=""
                placeholder="Select Category"
              >
                {categories?.map((category) => (
                  <Select.Option value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div>
            <Form.Item<FieldType>
              rules={[{ required: true, message: "Please select a category" }]}
              className="w-[49%] "
              label="User Type"
              name="userType"
            >
              <Select className="" placeholder="Select Category">
                <Select.Option value="normal">Normal</Select.Option>
                <Select.Option value="premium">Premium</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <FormItem
            className="w-full px-4"
            label={
              <Title className="!mb-0" level={5}>
                Coupon Type
              </Title>
            }
          >
            <Form.Item<FieldType>
              rules={[
                { required: true, message: "Please select a discount type" },
              ]}
              name="discountType"
            >
              <Radio.Group>
                <Radio value="percentage">
                  <Title className="!mb-0" level={5}>
                    Percentage
                  </Title>
                </Radio>
                <Radio value="amount">
                  <Title className="!mb-0" level={5}>
                    Fixed Amount
                  </Title>
                </Radio>
                <Radio value="free-shipping">
                  <Title className="!mb-0" level={5}>
                    Free Shipping
                  </Title>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </FormItem>

          <div className="flex gap-4 mx-[12px]">
            <Form.Item<FieldType>
              className="w-full"
              label="Discount"
              name="discountValue"
              rules={[
                { required: true, message: "Please input Discount Value" },
              ]}
            >
              <InputNumber
                className="py-2 w-full"
                placeholder="Discount Value"
              />
            </Form.Item>
            <Form.Item<FieldType>
              className="w-full"
              label="Usage Limit"
              name="maxUsageNumber"
              rules={[{ required: true, message: "Please input Usage Limit" }]}
            >
              <InputNumber className="py-2 w-full" placeholder="Usage Limit" />
            </Form.Item>
          </div>

          <div className="px-[12px]">
            <Form.Item<FieldType>
              className="w-full "
              label="Max Amount"
              name="maxAmount"
              rules={[{ required: true, message: "Please input Max Amount" }]}
            >
              <InputNumber className="py-2 w-[49%]" placeholder="Usage Limit" />
            </Form.Item>
          </div>

          <div className="mx-[12px] mb-4">
            <Title className="!mb-0" level={4}>
              Schedule
            </Title>
            <Text>Use these settings to limit the coupon expiration date.</Text>
          </div>

          <div className="flex gap-4 mx-[12px]">
            <Form.Item
              rules={[{ required: true, message: "Please input Start Date" }]}
              className="w-full "
              label="Start Date"
              name="startDate"
            >
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                showTime
                onChange={(date, dateString: string | string[]) =>
                  setStartDate(dateString)
                }
                className="w-full py-2"
              />
            </Form.Item>
            <FormItem
              rules={[
                { required: true, message: "Please input End Date" },
                {
                  validator: (_, value) => {
                    if (!value || !form.getFieldValue("startDate")) {
                      return Promise.resolve();
                    }
                    if (new Date(startDate) > new Date(endDate)) {
                      return Promise.reject(
                        "End date must be greater than start date"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              className="w-full"
              label="End Date"
              name="expirationDate"
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                onChange={(date, dateString: string | string[]) =>
                  setEndDate(dateString)
                }
                className="w-full py-2"
              />
            </FormItem>
          </div>
        </Form>
      </div>
      <SubmitSection form={form} isLoading={isLoading} />
    </div>
  );
}
