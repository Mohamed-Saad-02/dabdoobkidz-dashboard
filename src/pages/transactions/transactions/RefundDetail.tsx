import { Button, Form, Input, Modal, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRefundRequestDetails,
  updateRefundRequest,
} from "../../../api/refund";
import Header from "../../../components/Header";
import openNotification from "../../../components/ui/Notfication";
import ReusableTable from "../../../components/ui/Table";

export default function TransactionDetailData() {
  const { id } = useParams<{ id: string }>();
  const [acceptModal, setAcceptModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const { data: transactionDetails, isloading } = useQuery<any>("refund", () =>
    getRefundRequestDetails(Number(id))
  );
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(
    (data) => updateRefundRequest(+id, data),
    {
      onSuccess: () => {
        openNotification({
          message: "Transaction Updated",
          description: "Transaction has been updated successfully",
          type: "success",
        });
        navigate("/refunds");
      },

      onError: (error) => {
        openNotification({
          message: "Failed to update Transaction",
          description: error?.response?.data.message || "Something went wrong",
          type: "error",
        });
      },
    }
  );
  const onFinish = (values: any) => {
    mutate({
      orderStatus: values.orderStatus,
      shippingStatus: values.shippingStatus,
    });
  };

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      TransactionNumber: transactionDetails?.orderReference,
      date: transactionDetails?.createdAt,
      name: transactionDetails?.customer,
      phone: transactionDetails?.phone,
      orderStatus: transactionDetails?.status,
      requestType: transactionDetails?.requestType,
      shippingStatus: transactionDetails?.shippingStatus,
      address: transactionDetails?.address,
      payment: transactionDetails?.paymentMethod,
    });
  }, [transactionDetails]);

  const { Title, Text } = Typography;
  const TransactionProductsTable = [
    {
      title: "product",
      render: (record: { product: { name: string; images: string[] } }) => {
        return (
          <div className="flex">
            <img
              src={record?.variant?.gallery[0]}
              alt={record?.product?.name}
              className="w-16 h-16 object-cover"
            />
            <div className="flex flex-col ml-4">
              <span>{record?.product?.name}</span>
            </div>
          </div>
        );
      },
    },

    {
      title: "SKU",
      render: (record: { variant: { sku: string } }) => {
        return <span>{record?.variant?.sku}</span>;
      },
    },
    {
      title: "Quantity",
      render: (record: { count: number }) => {
        return <span>{record?.count}</span>;
      },
    },
    {
      title: "Price",
      render: (record: { variant: { price: number } }) => {
        return <span>{record?.variant?.price}</span>;
      },
    },
    {
      title: "Total",
      render: (record: { totalPrice: number }) => {
        return <span>{record?.totalPrice}</span>;
      },
    },
  ];

  return (
    <div className="">
      <Form
        form={form}
        labelCol={{ span: 16 }}
        onFinish={onFinish}
        wrapperCol={{ span: 24 }}
        className="flex flex-col gap-4 "
      >
        <div className="bg-white rounded-md p-4">
          <Header title="Transaction Details" />

          <div className="flex gap-12 p-4 items-center">
            <Title level={5} className="!mb-0 w-[300px]">
              Transaction Number
            </Title>
            <Form.Item name="TransactionNumber">
              <Input
                defaultValue={
                  transactionDetails?.transactionDetails?.orderReference
                }
                disabled={true}
                className="w-[600px] py-2"
              />
            </Form.Item>
          </div>

          <div className="flex gap-12 p-4 items-center">
            <Title level={5} className="!mb-0 w-[300px]">
              Date
            </Title>

            <Form.Item
              rules={[{ required: true, message: "Please input your name!" }]}
              name="date"
            >
              <Input
                defaultValue={transactionDetails?.transactionDetails?.createdAt}
                disabled={true}
                className="w-[600px] py-2"
              />
            </Form.Item>
          </div>

          <div className="flex gap-12 p-4 items-center">
            <Title level={5} className="!mb-0 w-[300px]">
              Invoice
            </Title>
            <Input disabled={true} className="w-[600px] py-2" value={"Admin"} />
          </div>
          <div className="flex gap-12 p-4 items-center">
            <Title level={5} className="!mb-0 w-[300px]">
              Customer Name
            </Title>
            <Form.Item name="name">
              <Input
                defaultValue={transactionDetails?.transactionDetails?.name}
                disabled={true}
                className="w-[600px] py-2"
              />
            </Form.Item>
          </div>
          <div className="flex gap-12 p-4 items-center">
            <Title level={5} className="!mb-0 w-[300px]">
              Phone Number
            </Title>
            <Form.Item name="phone">
              <Input disabled={true} className="w-[600px]" defaultValue="" />
            </Form.Item>
          </div>

          <div className="flex gap-12 p-4 items-center">
            <div className="max-w-[300px] flex flex-col gap-2">
              <Title level={5} className="!mb-0">
                Request Type
              </Title>
              <Text className="text-[12px]">
                This is the customer's order status. You can arrange your
                customer's order status according to the order process.
              </Text>
            </div>
            <Form.Item className="w-[600px] py-2" name="requestType">
              <Input
                disabled={true}
                className="w-[600px] py-2"
                defaultValue={
                  transactionDetails?.transactionDetails?.orderStatus
                }
              />
            </Form.Item>
          </div>
          <div className="flex gap-12 p-4 items-center">
            <div className="max-w-[300px] flex flex-col gap-2">
              <Title level={5} className="!mb-0">
                Status
              </Title>
              <Text className="text-[12px]">
                This is the customer's order status. You can arrange your
                customer's order status according to the order process.
              </Text>
            </div>
            <Form.Item className="w-[600px] py-2" name="orderStatus">
              <Input
                disabled={true}
                className="w-[600px] py-2"
                defaultValue={
                  transactionDetails?.transactionDetails?.orderStatus
                }
              />
            </Form.Item>
          </div>
        </div>

        <div className="bg-white rounded-md flex flex-col p-4">
          <Header title="Shipping Details" />
          <div className="flex gap-12 p-4 items-center">
            <Title level={5} className="!mb-0 w-[300px]">
              Receipt number
            </Title>
            <Form.Item name="avatar">
              <Input disabled={true} className="w-[600px] py-2" />
            </Form.Item>
          </div>
          <div className="flex gap-12 p-4 items-center">
            <Title level={5} className="!mb-0 w-[300px]">
              Shipping Status
            </Title>
            <Form.Item className="w-[600px] py-2" name="shippingStatus">
              <Select
                defaultValue={transactionDetails?.transactionDetails?.Pending}
                className=""
              >
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Delivered">Delivered</Select.Option>
                <Select.Option value="Cancelled">Cancelled</Select.Option>
                <Select.Option value="Returned">Returned</Select.Option>
                {/* <Select.Option value="Cancelled">Cancelled</Select.Option> */}
                <Select.Option value="Shipped">Shipped</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <div className="flex gap-12 p-4 items-center">
            <Title level={5} className="!mb-0 w-[300px]">
              Address
            </Title>
            <Form.Item name="address">
              <Input disabled={true} className="w-[600px] py-2" />
            </Form.Item>
          </div>
          <div className="flex gap-12 p-4 items-center">
            <Title level={5} className="!mb-0 w-[300px]">
              Payment
            </Title>
            <Form.Item name="payment">
              <Input disabled={true} className="w-[600px] py-2" />
            </Form.Item>
          </div>
        </div>

        <div className="bg-white p-4">
          <Header title="Transaction Products" />
          {transactionDetails?.items?.map((item) => {
            const currentVariants =
              item?.variant?.options?.map((v) => ({
                title: v?.option?.name,
                render: () => {
                  return <span>{v?.value?.value}</span>;
                },
              })) || [];

            return (
              <ReusableTable
                dataSource={[item]}
                columns={TransactionProductsTable}
              />
            );
          })}
        </div>

        <div className="bg-white rounded-md flex justify-end gap-4 p-4">
          <Button onClick={() => setRejectModal(true)}>Reject</Button>
          <Button onClick={() => setAcceptModal(true)} type="primary">
            Accept
          </Button>
        </div>
      </Form>
      <Modal
        title="Accept Request"
        open={acceptModal}
        onCancel={() => setAcceptModal(false)}
        footer={null}
      >
        <div className="flex flex-col gap-4 text-center">
          Are you sure you want to accept this Request?
          <div className="flex justify-end gap-4">
            <Button onClick={() => setAcceptModal(false)}>Cancel</Button>
            <Button
              onClick={() => {
                mutate({
                  requestType: transactionDetails?.requestType,
                  status: "approved",
                });
                setAcceptModal(false);
              }}
              loading={isLoading}
              type="primary"
            >
              Accept
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Reject Request"
        open={rejectModal}
        onCancel={() => setRejectModal(false)}
        footer={null}
      >
        <div className="flex flex-col gap-4 text-center">
          Are you sure you want to reject this Request?
          <div className="flex justify-end gap-4">
            <Button onClick={() => setRejectModal(false)}>Cancel</Button>
            <Button
              onClickCapture={() => {
                mutate({
                  requestType: transactionDetails?.requestType,
                  status: "rejected",
                });
                setRejectModal(false);
              }}
              loading={isLoading}
              type="primary"
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
