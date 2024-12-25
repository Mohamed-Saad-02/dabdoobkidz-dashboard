import { PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { addOption, getOptionById, updateOption } from "../../api/options";
import { ApiError } from "../../types/ApiError";
import SubmitSection from "../common/SubmitSection";
import openNotification from "../ui/Notfication";

export default function OptionForm({ type }: { type: "add" | "edit" }) {
  const { id, optionId } = useParams<{ id: string; optionId: string }>();

  type FieldType = {
    value: string;
    default: boolean;
  };
  const [form] = Form.useForm();
  const { Title } = Typography;

  const [values, setvalues] = useState<FieldType[]>([
    {
      value: "",
      default: true,
    },
  ]);
  const navigate = useNavigate();
  const {
    mutate: addOptionMutation,
    isLoading: addLoading,
    isSuccess: addSuccess,
  } = useMutation(
    (data) => {
      return addOption(data, id);
    },
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Option Successfully",
          description: "Option has been Created successfully",
        });
        navigate(`/product/${id}?tab=2`);
        form.resetFields();
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Error Creating Option",
          description: error.response?.data.message || "Something went wrong",
        });
      },
    }
  );

  const {
    mutate: updateOptionMutation,
    isLoading: updateOptionLoading,
    isSuccess: updateSuccess,
  } = useMutation((data) => updateOption(Number(id), Number(optionId), data), {
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Option Updated Successfully",
        description: "Option has been updated successfully",
      });

      form.resetFields();
      navigate(`/product/${id}?tab=2`);
    },
    onError: (error: ApiError) => {
      openNotification({
        type: "error",
        message: "Error Updating Option",
        description: error.response?.data.message || "Something went wrong",
      });
    },
  });

  const { data: option } = useQuery(
    "option",
    () => getOptionById(Number(id), Number(optionId)),
    {
      enabled: type === "edit",
    }
  );

  useEffect(() => {
    if (option?.values) {
      setvalues((prev) =>
        option.values.map((value) => ({
          value: value.value,
          default: value.default,
        }))
      );
    }
    form.setFieldsValue({
      name: option?.name,
      optionType: option?.type,
      ...Object.fromEntries(
        option?.values?.map((value, index) => [
          `values[${index}].name`,
          value?.value ?? "",
        ]) ?? []
      ),
    });
  }, [option]);
  const onFinish = (valuesData) => {
    const data = {
      name: valuesData.name,
      type: valuesData.optionType,
      default: "",
      order: Math.floor(Math.random() * 100),
      values: values.map((value) => ({
        ...value,
      })),
    };

    if (type === "add") {
      addOptionMutation(data);
    } else {
      updateOptionMutation(data);
    }
  };

  return (
    <div className="flex flex-col  gap-4">
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        className="flex flex-col gap-6 bg-white p-4 rounded-md"
      >
        <div className="flex gap-[24px] w-full">
          <Form.Item
            label="Option Name"
            name="name"
            rules={[{ required: true, message: "Please Product Name!" }]}
            className="!mb-0 w-full"
          >
            <Input placeholder="for example size" className="py-2" />
          </Form.Item>
          <Form.Item
            label="Option Name"
            name="optionType"
            rules={[{ required: true, message: "Please Product Name!" }]}
            className="!mb-0 w-full"
          >
            <Select placeholder="Select Option Type">
              <Select.Option value="Drop-down list">
                Dropdown list
              </Select.Option>
              <Select.Option value="2">Color</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <Form.Item name="preselect" className="mt-[12px]">
          <Checkbox>Do not preselect default value</Checkbox>
        </Form.Item>

        <div className="flex flex-col gap-[16px]">
          <Title level={4} className=" !mb-0">
            Option Values
          </Title>

          {values.map((value, index) => (
            <div key={index} className="flex gap-[24px] w-[900px]">
              <div className="flex gap-2 w-full">
                <span className="text-[20px] font-[600]  ">=</span>
                <Form.Item
                  name={`values[${index}].name`}
                  rules={[{ required: true, message: "Please Product Name!" }]}
                  className="w-full"
                >
                  <Input
                    key={index}
                    onChange={(value) => {
                      setvalues((prev) => {
                        const newValues = [...prev];
                        newValues[index] = {
                          ...newValues[index],
                          value: value.target.value,
                        };
                        return newValues;
                      });
                    }}
                    placeholder="Enter Value"
                    className="py-2"
                  />
                </Form.Item>
              </div>

              {index !== 0 && (
                <Button
                  onClick={() =>
                    setvalues((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="bg-transparent text-primary flex gap-1 items-center cursor-pointer"
                >
                  <PlusOutlined />
                  Remove
                </Button>
              )}
            </div>
          ))}
          <span
            onClick={() =>
              setvalues((prev) => [...prev, { value: "", default: false }])
            }
            className="bg-transparent text-primary flex gap-1 items-center cursor-pointer"
          >
            <PlusOutlined />
            Add values
          </span>
        </div>
      </Form>
      <SubmitSection
        form={form}
        isLoading={type === "add" ? addLoading : updateOptionLoading}
      />
    </div>
  );
}
