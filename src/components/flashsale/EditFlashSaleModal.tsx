import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Space, Switch } from "antd";
import { useEffect, useState } from "react";
import { Product } from "../../types/Product";
import ReusableTable from "../ui/Table";

type DiscountTableProps = {
  dataSource: Product[];
  discountForm: any;
  isModalOpen: boolean;
  setisModalOpen: any;
  seDataSource: any;
};

export const EditFlashSaleModal = ({
  dataSource,
  isModalOpen,
  setisModalOpen,
  seDataSource,
}: DiscountTableProps) => {
  console.log(dataSource, "modaldata123foreditmodal");
  const [editForm] = Form.useForm();

  const [editData, setEditData] = useState(dataSource);

  const onFinish = (values) => {
    seDataSource(editData);
    console.log(editData, "edidatabeforeset");

    console.log(dataSource, "editdatafromeditmodal");
    setisModalOpen(false);
  };

  useEffect(() => {
    setEditData(dataSource);
    dataSource.forEach((item: any) => {
      console.log(item, "itemfromeditmodal");
      editForm.setFieldsValue({
        [`stock[${item.id}]`]: item?.stock,
        [`discountType[${item.id}]`]: item?.discountType,
        [`discount[${item.id}]`]: item?.discountAmount,
        [`ignorePlan[${item.id}]`]: item?.ignorePlan,
      });
    });
  }, [dataSource]);
  const discountTable = [
    {
      title: "Product Name",
      render: (record: { product: { name: string } }) => {
        console.log(record.product?.name, "productnamezzzineditmodal");

        return <p>{record.product?.name}</p>;
      },
      key: "name",
    },
    {
      title: "Category",
      render: (record: { product: { category: { name: string } } }) => (
        <p>{record?.product?.category?.name}</p>
      ),
      key: "category",
    },
    {
      title: "Price",
      render: (record: { product: { price: number } }) => {
        return <p>{record.product?.price}</p>;
      },
      key: "price",
    },
    {
      title: "Ignore Plan",
      render: (record: { id }) => (
        <Form.Item name={`ignorePlan[${record.id}]`} valuePropName="checked">
          <Switch
            onChange={(value) => {
              const newEditData = editData.map((item) => {
                if (item.id === record.id) {
                  return {
                    ...item,
                    ignorePlan: value,
                  };
                }
                return item;
              });
              setEditData(newEditData);
            }}
            // checked={editForm.getFieldValue(`ignorePlan[${record.id}]`)}
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
          <Input
            onChange={(e) => {
              const newEditData = editData.map((item) => {
                if (item.id === record.id) {
                  return {
                    ...item,
                    stock: e.target.value,
                  };
                }
                return item;
              });
              setEditData(newEditData);
            }}
          />
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
                const newEditData = editData.map((item) => {
                  if (item.id === record.id) {
                    return {
                      ...item,
                      discountType: value,
                    };
                  }
                  return item;
                });
                setEditData(newEditData);
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
            <Input
              onChange={(e) => {
                const newEditData = editData.map((item) => {
                  if (item.id === record.id) {
                    return {
                      ...item,
                      discountAmount: e.target.value,
                    };
                  }
                  return item;
                });
                setEditData(newEditData);
              }}
              className="w-[46px]"
            />
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
            const newEditData = editData.filter(
              (item) => item.id !== record.id
            );
            setEditData(newEditData);
          }}
          className="text-red-500 text-[20px]"
        />
      ),
      key: "action",
    },
  ];

  return (
    <Modal
      open={isModalOpen}
      width={"70%"}
      onClose={() => setisModalOpen(false)}
      onCancel={() => setisModalOpen(false)}
      footer={() => {
        return (
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => {
                setisModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                editForm.submit();
              }}
            >
              Save
            </Button>
          </div>
        );
      }}
    >
      <div>
        <div className="flex flex-col gap-4 items-center my-4">
          <h1 className="text-[#101623] text-[24px] font-[500]">
            Set Discount
          </h1>
          <p className="text-gray ">
            Set a discount for each product in the flash sale
          </p>
        </div>
        <Form
          initialValues={{
            remember: true,
          }}
          form={editForm}
          onFinish={onFinish}
        >
          <ReusableTable
            paginationConfig={false}
            columns={discountTable}
            dataSource={editData}
          />
        </Form>
      </div>
    </Modal>
  );
};
