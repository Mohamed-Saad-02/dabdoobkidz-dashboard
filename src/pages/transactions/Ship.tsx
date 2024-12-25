import { DatePicker, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getCities, getGovernorates } from "../../api/constants";
import { shipTransaction } from "../../api/ship";
import { getTransactionDetails } from "../../api/transaction";
import SubmitSection from "../../components/common/SubmitSection";
import Loading from "../../components/Loading";
import openNotification from "../../components/ui/Notfication";

export default function Ship(values: any) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery("ship", () =>
    getTransactionDetails(Number(id))
  );

  const { data: cities, isLoading: cititesLoading } = useQuery("cities", () => {
    return getCities();
  });
  const { data: governorates, isLoading: governoratesLoading } = useQuery(
    "governorates",
    () => {
      return getGovernorates();
    }
  );
  const [form] = Form.useForm();

  const { mutate, isLoading: mutationLoading } = useMutation(
    (shipValues) => shipTransaction(Number(id), shipValues),
    {
      onSuccess: () => {
        openNotification({
          message: "Success",
          description: "Transaction Shipped Successfully",
          type: "success",
        });
        form.resetFields();
        navigate("/transactions");
      },
      onError: (err) => {
        openNotification({
          message: "Something Went Wrong",
          description: err?.response?.data?.message,
          type: "error",
        });
      },
    }
  );

  useEffect(() => {
    console.log(data, "shippmentData");

    if (data) {
      form.setFieldsValue({
        warehouseName: data?.warehouse?.name,
        customerName: data?.name,
        phoneNumber: data?.phone,
        cityCode: data?.cityCode === "N/A" ? null : data?.cityCode,
        governorateCode:
          data?.governorateCode === "N/A" ? null : data?.governorateCode,

        weight: data?.weight,
        allowToOpenPackage: data?.allowToOpenPackage,
        street: data?.street,
      });
    }
  }, [data]);
  if (isLoading) {
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );
  }
  const onFinish = (values) => {
    console.log(values.pickupDueDate, "Date");

    const data = {
      warehouseName: values.warehouseName,
      customerName: values.customerName,
      cityCode: values.cityCode === "N/A" ? null : values.cityCode,
      governorateCode:
        values.governorateCode === "N/A" ? null : values.governorateCode,
      street: values.street,
      phoneNumber: values.phoneNumber,
      weight: +values.weight,
      allowToOpenPackage: values.allowToOpenPackage,
      pickupDueDate: values.pickupDueDate,
      description: values.description,
    };

    mutate(data);
  };

  return (
    <Form
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
      className="flex flex-col gap-4"
      form={form}
    >
      <div className="bg-white p-4 rounded-md">
        <h1 className="font-[600] text-[22px] mb-4">Shipping Information</h1>
        <div className="flex gap-[12px] w-full">
          <Form.Item
            label="Warehouse Name"
            name="warehouseName"
            rules={[
              { required: true, message: "Please input Warehouse Name!" },
            ]}
            className="w-full"
          >
            <Input placeholder="Enter Warehouse Name" className="w-full py-2" />
          </Form.Item>
          <Form.Item
            label="Customer Name"
            name="customerName"
            className="w-full"
            rules={[{ required: true, message: "Please input Customer Name!" }]}
          >
            <Input placeholder="Enter Customer Name" className="w-full py-2" />
          </Form.Item>
        </div>
        <div className="flex gap-[12px] w-full">
          <Form.Item
            label="City Code"
            name="cityCode"
            rules={[{ required: true, message: "Please input City Code!" }]}
            className="w-full"
          >
            <Select placeholder="Please Select a City">
              {cities?.map((city) => (
                <Select.Option value={city.code}>
                  {city?.name?.en}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Governorate Code"
            name="governorateCode"
            className="w-full"
            rules={[
              { required: true, message: "Please input Governorate COde!" },
            ]}
          >
            <Select placeholder="Please Select a Governorate">
              {governorates?.map((governorate) => (
                <Select.Option value={governorate.code}>
                  {governorate?.name?.en}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="flex gap-[12px] w-full">
          <Form.Item
            label="Street"
            name="street"
            rules={[{ required: true, message: "Please input Street" }]}
            className="w-full"
          >
            <Input placeholder="Enter Street" className="w-full py-2" />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            className="w-full"
            rules={[{ required: true, message: "Please input Phone Number!" }]}
          >
            <Input
              type="number"
              placeholder="Enter a Phone Number"
              className="w-full py-2"
            />
          </Form.Item>
        </div>
        <div className="flex gap-[12px] w-full">
          <Form.Item
            label="Wieght"
            name="weight"
            rules={[{ required: true, message: "Please input Weight" }]}
            className="w-full"
          >
            <Input
              placeholder="Enter Weight"
              type="number"
              className="w-full py-2"
            />
          </Form.Item>
          <Form.Item
            label="Allow to open package"
            name="allowToOpenPackage"
            className="w-full"
            rules={[{ required: true, message: "Please Select an option" }]}
          >
            <Select placeholder="Select an option">
              <Select.Option value={true}>Allow</Select.Option>
              <Select.Option value={false}>Don't Allow</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="flex gap-[12px] w-full">
          <Form.Item
            label="Pickup Due Date"
            name={"pickupDueDate"}
            className="w-full"
            rules={[
              { required: true, message: "Please input Pickup Due Date" },
            ]}
          >
            <DatePicker className="w-full py-2" />
          </Form.Item>

          <Form.Item
            label="Description"
            name={"description"}
            className="w-full"
            rules={[{ required: true, message: "Please input Description" }]}
          >
            <Input.TextArea
              placeholder="Enter Description"
              className="w-full py-2"
            />
          </Form.Item>
        </div>
      </div>
      <SubmitSection form={form} isLoading={mutationLoading} />
    </Form>
  );
}
