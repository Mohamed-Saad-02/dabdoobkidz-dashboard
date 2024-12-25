import { DatePicker, Form, FormInstance } from "antd";
import { useState } from "react";

type DateFormProps = {
  DateForm1: FormInstance;
  setSaleInfo: (value: any) => void;
};
export const DateForm = ({ DateForm1, setSaleInfo }: DateFormProps) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();


  const onFinish = (values) => {
  
  };
  return (
    <Form layout="vertical" form={DateForm1}
      initialValues={{ remember: true }}
    onFinish={onFinish}>
      <div className="flex flex-col gap-4 items-center my-4">
        <h1 className="text-[#101623] text-[24px] font-[500]">
          Set Date & Time
        </h1>
        <p className="text-gray ">
          Set the start and end date and time for the flash sale
        </p>
      </div>
      <div className="flex gap-4">
        <Form.Item
          rules={[{ required: true, message: "Please input Start Date" }]}
          className="w-full "
          label="Start Date"
          name="startDate"
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            showTime
            onChange={(date, dateString: string | string[]) => {
              setStartDate(dateString);
              setSaleInfo((prev) => ({ ...prev, start: dateString }));
            }}
            className="w-full py-2"
          />
        </Form.Item>
        <Form.Item
          rules={[
            { required: true, message: "Please input End Date" },
            {
              validator: (_, value) => {
     

                if (!value || !DateForm1.getFieldValue("startDate")) {
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
            onChange={(date, dateString: string | string[]) => {
              setEndDate(dateString);
              setSaleInfo((prev) => ({ ...prev, end: dateString }));
            }}
            className="w-full py-2"
          />
        </Form.Item>
      </div>
    </Form>
  );
};
