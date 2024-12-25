import { Button, Form, Input, Select, Switch, Typography } from "antd";
import Header from "../Header";
import SubmitSection from "../common/SubmitSection";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { useMutateHook } from "../../hooks/useMutateHook";
import { addPlanMutation, getPlan, updatePlanMutation } from "../../api/plans";
import { PlusOutlined } from "@ant-design/icons";

type BrandsFormProps = {
  type: "add" | "edit";
};

type FieldType = {
  name: string;
  subTitle: string;
  description: string;
  isActive: boolean;
  duration: string;
  price: number;
};

export default function PlansForm({ type }: BrandsFormProps) {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { Title } = Typography;

  const { data: brand } = useQuery(
    "plan",
    () => {
      return getPlan(Number(id));
    },
    {
      enabled: type === "edit",
    }
  );

  const { mutate, isLoading, isSuccess } = useMutateHook(
    "plan",
    type === "add" ? addPlanMutation() : updatePlanMutation(Number(id))
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (brand) {
      form.setFieldsValue({
        name: brand.name,
        isActive: brand.isActive,
        subTitle: brand.subtitle,
        description: brand.description,
        duration: brand.duration,
        price: brand.price,
      });
      setIncludedBenfits(brand?.incudes);
      setExcludedBenfits(brand?.excludes);
    }
  }, [brand]);
  if (isSuccess) {
    form.resetFields();
    navigate("/plans");
  }
  const onFinish = (values) => {
    console.log(includedBenfits, "includedBenfits");

    const data = {
      name: values.name,
      isActive: values.isActive,
      subtitle: values.subTitle,
      description: values.description,
      duration: values.duration,
      price: Number(values.price),
      incudes: includedBenfits.filter((item) => item !== ""),
      excludes: excludedBenfits.filter((item) => item !== ""),
    };
    console.log(data, "plan data before sumit");

    mutate(data);
  };

  const [includedBenfits, setIncludedBenfits] = useState<string[]>([""]);
  const [excludedBenfits, setExcludedBenfits] = useState<string[]>([""]);
  return (
    <div className="flex flex-col gap-4">
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        autoComplete="off"
        className="flex flex-col gap-6 bg-white p-4 rounded-[10px]"
      >
        <Header title={type === "add" ? "Add Plan" : "Edit Plan"} />
        <div className="flex gap-12 p-4">
          <Title level={4} className="w-[300px] !mb-0">
            Name
          </Title>
          <Form.Item<FieldType>
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="Enter a name"
              className="w-[600px] py-2 mx-auto"
            />
          </Form.Item>
        </div>
        <div className="flex gap-12 p-4">
          <Title level={4} className="w-[300px] !mb-0">
            Subtitle
          </Title>
          <Form.Item<FieldType>
            name="subTitle"
            rules={[{ required: true, message: "Please Enter a Subtitle" }]}
          >
            <Input
              placeholder="Enter a Subtitle"
              className="w-[600px] py-2 mx-auto"
            />
          </Form.Item>
        </div>

        <div className="flex gap-12 p-4">
          <Title level={4} className="w-[300px] !mb-0">
            Description
          </Title>
          <Form.Item<FieldType>
            name="description"
            rules={[{ required: true, message: "Please Enter a Description" }]}
          >
            <Input
              placeholder="Enter a Description"
              className="w-[600px] py-2 mx-auto"
            />
          </Form.Item>
        </div>
        <div className="flex gap-12 p-4">
          <Title level={4} className="w-[300px] !mb-0">
            Duration
          </Title>
          <Form.Item<FieldType>
            name="duration"
            className="w-[600px]"
            rules={[{ required: true, message: "Please Enter a Duration" }]}
          >
            <Select placeholder="Enter a Duration" className=" mx-auto">
              <Select.Option value="Monthly">Monthly</Select.Option>
              <Select.Option value="Annually">Yearly</Select.Option>
              <Select.Option value="AllTime">All Time</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="flex gap-12 p-4">
          <Title level={4} className="w-[300px] !mb-0">
            Price
          </Title>
          <Form.Item<FieldType>
            name="price"
            className="w-[600px]"
            rules={[{ required: true, message: "Please Enter a Price" }]}
          >
            <Input
              placeholder="Enter a price"
              type="number"
              className="w-[600px] py-2 mx-auto"
            />
          </Form.Item>
        </div>

        <div className="flex gap-12 p-4">
          <Title level={4} className="w-[300px] !mb-0">
            Active
          </Title>
          <Form.Item<FieldType>
            name="isActive"
            rules={[{ required: true, message: "Please choose the status" }]}
          >
            <Switch className="mx-auto" />
          </Form.Item>
        </div>

        <div className="flex gap-12 p-4">
          <Title level={4} className="w-[300px] !mb-0">
            Included Benfits
          </Title>
          <div className="flex flex-col gap-[12px] justify-start items-start">
            {includedBenfits.map((_, index) => (
              <div key={index} className="flex gap-4">
                <Input
                  placeholder="Enter a name"
                  name={`includedBenfits[${index}]`}
                  className="w-[600px] py-2 mx-auto"
                  onChange={(e) => {
                    const newBenfits = includedBenfits.map((item, i) => {
                      if (index === i) {
                        return e.target.value;
                      }
                      return item;
                    });
                    setIncludedBenfits(newBenfits);
                  }}
                />
                {index !== 0 && (
                  <Button
                    onClick={() => {
                      const newBenfits = includedBenfits.filter(
                        (_, i) => index !== i
                      );
                      setIncludedBenfits(newBenfits);
                    }}
                    icon={<PlusOutlined />}
                    className="w-fit"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}

            <Button
              className="w-fit"
              onClick={() => {
                setIncludedBenfits([...includedBenfits, ""]);
              }}
              icon={<PlusOutlined />}
            >
              Add
            </Button>
          </div>
        </div>

        <div className="flex gap-12 p-4">
          <Title level={4} className="w-[300px] !mb-0">
            Excluded Benfits
          </Title>
          <div className="flex flex-col gap-[12px] justify-start items-start">
            {excludedBenfits.map((_, index) => (
              <div key={index} className="flex gap-4">
                <Input
                  placeholder="Enter a name"
                  name={`excludedBenfits[${index}]`}
                  className="w-[600px] py-2 mx-auto"
                  onChange={(e) => {
                    const newBenfits = excludedBenfits.map((item, i) => {
                      if (index === i) {
                        return e.target.value;
                      }
                      return item;
                    });
                    setExcludedBenfits(newBenfits);
                  }}
                />
                {index !== 0 && (
                  <Button
                    onClick={() => {
                      const newBenfits = excludedBenfits.filter(
                        (_, i) => index !== i
                      );
                      setExcludedBenfits(newBenfits);
                    }}
                    icon={<PlusOutlined />}
                    className="w-fit"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}

            <Button
              className="w-fit"
              onClick={() => {
                setExcludedBenfits([...excludedBenfits, ""]);
              }}
              icon={<PlusOutlined />}
            >
              Add
            </Button>
          </div>
        </div>
      </Form>
      <SubmitSection form={form} isLoading={isLoading} />
    </div>
  );
}
