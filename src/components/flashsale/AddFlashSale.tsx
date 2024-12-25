import { Button, Form, Steps } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { createFlashsale } from "../../api/flashsales";
import { Product } from "../../types/Product";
import ModalComponent from "../ui/Modal";
import openNotification from "../ui/Notfication";
import { Confirmation } from "./Confirmation";
import { DateForm } from "./DateForm";
import { DiscountTable } from "./DiscountTable";

type AddFlashSaleProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  selectedRows: Product[];
};

export default function AddFlashSale({
  isModalOpen,
  setIsModalOpen,
  selectedRows,
}: AddFlashSaleProps) {
  const [DateForm1] = Form.useForm();
  const [DiscountForm2] = Form.useForm();
  const [confirmationForm3] = Form.useForm();
  const [step, setStep] = useState(0);
  const navigation = useNavigate();

  const [saleInfo, setSaleInfo] = useState({});
  const queryClient = useQueryClient();
  // console.log(saleInfo, "saleInfotestforignorePlan");

  const { mutate, isLoading } = useMutation(
    (flashsaleSubmiData) => createFlashsale(flashsaleSubmiData),
    {
      onSuccess: () => {
        openNotification({
          message: "Flash Sale Added Successfully",
          type: "success",
          description: "Flash Sale has been added successfully",
        });
        setIsModalOpen(false);
        queryClient.invalidateQueries("flashsale");
        navigation("/sales");
      },
      onError: (error) => {
        console.log(error, "error from flashsale");

        openNotification({
          message: "Error Adding Flash Sale",
          type: "error",
          description:
            error?.response?.data.errors[0]?.message || "Something went wrong",
        });
      },
    }
  );
  const handleOk = () => {
    if (step === 0) {
      DateForm1.validateFields()
        .then((values) => {
          setStep(1);
        })
        .catch((error) => {});
    }
    if (step === 1) {
      DiscountForm2.validateFields()
        .then((values) => {
          console.log(values, "values from step 1");

          // setSaleInfo(prev => ({...prev, discount: values.discount, discountType: values.discountType}));
          setSaleInfo((prev) => ({
            ...prev,
            ...selectedRows.reduce((acc: any, item: any) => {
              const discountType =
                values[`discountType[${item.id}]`] || "percentage";

              acc[`discountType[${item.id}]`] = discountType;
              acc[`discountAmount[${item.id}]`] =
                values[`discount[${item.id}]`];
              acc[`stock[${item.id}]`] = values[`stock[${item.id}]`];
              acc[`ignorePlan[${item.id}]`] =
                values[`ignorePlan[${item.id}]`] || false;
              return acc;
            }, {}),
          }));

          setStep(2);
        })
        .catch((error) => {});
    }
    if (step === 2) {
      confirmationForm3
        .validateFields()
        .then((values) => {
          const submitData = {
            start: saleInfo.start,
            end: saleInfo.end,
            products: selectedRows.map((item) => {
              return {
                product: +item.id,
                discountAmount: +saleInfo[`discountAmount[${item.id}]`],
                discountType: saleInfo[`discountType[${item.id}]`],
                stock: +saleInfo[`stock[${item.id}]`],
                ignorePlan: saleInfo[`ignorePlan[${item.id}]`],
              };
            }),
          };
          console.log(submitData, "submitData from step 2");

          mutate(submitData);
          // setIsModalOpen(false);
        })
        .catch((error) => {
          console.log(error, "error from step 2");
        });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const steps = [
    {
      title: "Set Date & Time",
      content: <DateForm setSaleInfo={setSaleInfo} DateForm1={DateForm1} />,
    },
    {
      title: "Select Merchant",
      content: (
        <DiscountTable discountForm={DiscountForm2} dataSource={selectedRows} />
      ),
    },
    {
      title: "Confirmation",
      content: (
        <Confirmation selectedRows={selectedRows} salesInfo={saleInfo} />
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <ModalComponent
      isModalOpen={isModalOpen}
      title="Add Flash Sale"
      handleOk={handleOk}
      handleCancel={handleCancel}
      width="50%"
      footer={
        <div className="flex gap-4 justify-end">
          <Button
            onClick={() => {
              setStep(step - 1);
            }}
            disabled={step === 0}
            className="bg-gray-200 text-black px-4 py-2 rounded"
          >
            Back
          </Button>
          <Button
            onClick={handleOk}
            loading={isLoading}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            {step === 2 ? "Add Flash Sale" : "Next"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6 mt-6">
        <Steps
          labelPlacement="vertical"
          items={items}
          current={step}
          className="max-w-[450px] mx-auto"
        />

        <span>{steps[step].content}</span>
      </div>
    </ModalComponent>
  );
}
