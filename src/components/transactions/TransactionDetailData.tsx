import { Form, Input, Select, Typography } from "antd";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { updateTransaction } from "../../api/transaction";
import { Order } from "../../types/Order";
import SubmitSection from "../common/SubmitSection";
import Header from "../Header";
import openNotification from "../ui/Notfication";
import ReusableTable from "../ui/Table";

type TransactionDetailDataProps = {
  transactionDetails?: Order;
};

export default function TransactionDetailData(
  transactionDetails: TransactionDetailDataProps
) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (data) => {
      console.log(data, "data from the mutation");

      updateTransaction(+id, data);
    },
    {
      onSuccess: () => {
        openNotification({
          message: "Transaction Updated",
          description: "Transaction has been updated successfully",
          type: "success",
        });
        queryClient.invalidateQueries("transaction");
        navigate("/transactions");
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
  useEffect(() => {
    form.setFieldsValue({
      TransactionNumber: transactionDetails?.transactionDetails?.orderReference,
      date: new Date(transactionDetails?.transactionDetails?.createdAt),
      name: transactionDetails?.transactionDetails?.name,
      phone: transactionDetails?.transactionDetails?.phone,
      orderStatus: transactionDetails?.transactionDetails?.orderStatus,
      shippingStatus: transactionDetails?.transactionDetails?.shippingStatus,
      address: transactionDetails?.transactionDetails?.address,
      payment: transactionDetails?.transactionDetails?.paymentMethod,
    });
  }, [transactionDetails]);
  const onFinish = (values: any) => {
    console.log(values, "values of the TRANSACTIONDETAIL");

    mutate({
      orderStatus: values.orderStatus,
      shippingStatus: values.shippingStatus,
    });
  };
  const [form] = Form.useForm();

  const { Title, Text } = Typography;

  const TransactionProductsTable = [
    {
      title: "product",
      render: (record: { product: { name: string; images: string[] } }) => {
        return (
          <div className="flex">
            <img
              src={record?.product?.images[0]}
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
  console.log(
    transactionDetails?.transactionDetails?.items,
    "itemszfrom transaction"
  );

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
                Status
              </Title>
              <Text className="text-[12px]">
                This is the customer's order status. You can arrange your
                customer's order status according to the order process.
              </Text>
            </div>
            {transactionDetails?.transactionDetails?.paymentMethod ===
            "Cash on Delivery" ? (
              <Form.Item className="w-[600px] py-2" name="orderStatus">
                <Select
                  disabled={
                    true
                    // transactionDetails?.transactionDetails?.shippingStatus ===
                    // "Delivered"
                    //   ? false
                    //   : true
                  }
                  defaultValue={
                    transactionDetails?.transactionDetails?.orderStatus
                  }
                >
                  <Select.Option value="Initiated">Initiated</Select.Option>
                  <Select.Option value="Paid">Paid</Select.Option>
                  <Select.Option value="Pending">Pending</Select.Option>
                  <Select.Option value="Failed">Failed</Select.Option>
                  <Select.Option value="Refunded">Refunded</Select.Option>
                  <Select.Option value="Partial Refunded">
                    Partial Refunded
                  </Select.Option>
                  <Select.Option value="Cancelled">Cancelled</Select.Option>
                </Select>
              </Form.Item>
            ) : null}
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
                disabled={
                  transactionDetails?.transactionDetails?.shippingStatus ===
                    "Pending" ||
                  transactionDetails?.transactionDetails?.shippingStatus ===
                    "Delivered"
                    ? true
                    : false
                }
                // defaultValue={transactionDetails?.transactionDetails?.Pending}
                className=""
              >
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Delivered">Delivered</Select.Option>
                {/* <Select.Option value="Cancelled">Cancelled</Select.Option>
                <Select.Option value="Returned">Returned</Select.Option> */}
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

          {/* {transactionDetails?.transactionDetails?.shippingStatus ===
            "Shipped" && (
            <Button className="bg-red-500 text-white hover:!text-white w-fit ml-auto hover:!bg-red-600">
              Cancel Shipping
            </Button>
          )} */}
        </div>

        <div className="bg-white p-4">
          <Header title="Transaction Products" />
          {transactionDetails?.transactionDetails?.items?.map((item) => {
            const currentVariants =
              item?.variant?.options.map((v) => ({
                title: v?.option?.name,
                render: () => {
                  return <span>{v?.value?.value}</span>;
                },
              })) || [];
            console.log(currentVariants, "currentVariants");

            const transformedColumns = TransactionProductsTable.reduce(
              (acc, curr, index) => {
                if (index === 1) {
                  return [...acc, ...currentVariants];
                }
                return [...acc, curr];
              },
              []
            );
            // console.log(transformedColumns, "transformedColumns");

            return (
              <ReusableTable dataSource={[item]} columns={transformedColumns} />
            );
          })}
        </div>

        <SubmitSection form={form} isLoading={isLoading} />
      </Form>
    </div>
  );
}
