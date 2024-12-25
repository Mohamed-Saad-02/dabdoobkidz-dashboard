import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { Form, Input, Select, Space, Switch } from "antd";
import { useEffect, useState } from "react";
import { Product } from "../../types/Product";
import ReusableTable from "../ui/Table";

type DiscountTableProps = {
  dataSource: Product[];
  discountForm: any;
};
export const DiscountTable = ({
  dataSource,
  discountForm,
}: DiscountTableProps) => {
  const [data, setData] = useState(dataSource);
  const [discountType, setDiscountType] = useState("percentage");
  const [ignorePlan, setIgnorePlan] = useState(false);

  useEffect(() => {
    dataSource.forEach((item) => {
      console.log(item, "dataSource from discountTable");

      discountForm.setFieldsValue(() => {
        return {
          [`discountType[${item.id}]`]: "percentage",

          [`ignorePlan[${item.id}]`]: false,
        };
      });
    });
  }, [dataSource]);
  const discountTable = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      render: (record: { category: { name: string } }) => (
        <p>{record.category.name}</p>
      ),
      key: "category",
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Ignore Plan",
      render: (record: { id }) => (
        <Form.Item name={`ignorePlan[${record.id}]`} valuePropName="checked">
          <Switch
            onChange={(value) => {
              discountForm.setFieldsValue({
                [`ignorePlan[${record.id}]`]: value,
              });
            }}
            checked={discountForm.getFieldValue(`ignorePlan[${record.id}]`)}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        </Form.Item>
      ),
    },
    {
      title: "Quota",
      render: (record: { id: number; stock: number }) => (
        <Form.Item
          name={`stock[${record.id}]`}
          rules={[
            { required: true, message: "Please input your Quota Value!" },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject("Quota must be greater than 0");
                }
                if (value > record.stock) {
                  return Promise.reject(
                    "Quota must be less than or equal to stock"
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
      ),
      key: "qouta",
    },
    {
      title: "Discount",
      render: (record: { id }) => (
        <Space.Compact>
          <Form.Item name={`discountType[${record.id}]`}>
            <Select
              onChange={(value) => {
                setDiscountType(value);
              }}
              defaultValue="percentage"
            >
              <Select.Option value="percentage">
                <PercentageOutlined />
              </Select.Option>
              <Select.Option value="amount">
                <DollarCircleOutlined />
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={`discount[${record.id}]`}
            rules={[
              { required: true, message: "Please input your Discount Value!" },
            ]}
          >
            <Input className="w-[46px]" />
          </Form.Item>
        </Space.Compact>
      ),
      key: "discount",
    },
    {
      title: "Action",
      render: (record: { id: number }) => (
        <DeleteOutlined
          onClick={() => {
            setData((prev) => prev.filter((item) => item.id !== record.id));
          }}
          className="text-red-500 text-[20px]"
        />
      ),
      key: "action",
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 items-center my-4">
        <h1 className="text-[#101623] text-[24px] font-[500]">Set Discount</h1>
        <p className="text-gray ">
          Set a discount for each product in the flash sale
        </p>
      </div>
      <Form form={discountForm}>
        <ReusableTable
          paginationConfig={false}
          columns={discountTable}
          dataSource={data}
        />
      </Form>
    </div>
  );
};
