import { DatePicker, Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getFlashsale, updateFlashSale } from "../../api/flashsales";
import EditIcon from "../../assets/common/edit.svg";
import SubmitSection from "../../components/common/SubmitSection";
import { EditFlashSaleModal } from "../../components/flashsale/EditFlashSaleModal";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import openNotification from "../../components/ui/Notfication";
import ReusableTable from "../../components/ui/Table";
import { flashsaleTable } from "../../constants/tables/FlashsaleDetailTable";

export default function FlashSaleDetails() {
  const { id } = useParams<{ id: string }>();
  const [editmodalOpen, setEditModalOpen] = useState(false);
  const [flashsaleProducts, setFlashsaleProducts] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [form] = Form.useForm();
  const { data, isLoading } = useQuery("flashsale", () => {
    return getFlashsale(+id);
  });

  const { mutate, isLoading: mutationLoading } = useMutation(
    (data) => {
      return updateFlashSale(+id, data);
    },
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Flashsale Updated",
          description: "Flashsale has been updated successfully",
        });
      },
      onError: (error) => {
        console.log(
          error?.response?.data?.errors[0],
          "errormessage in updatflashsale"
        );

        openNotification({
          type: "error",
          message: "Problem Updating Flashsale",
          description: error?.response?.data?.errors[0]?.message,
        });
      },
    }
  );

  useEffect(() => {
    if (data) {
      setFlashsaleProducts(data?.products);
      const parsedStartDate = dayjs(data?.start);
      const parsedEndDate = dayjs(data?.end);

      setStartDate(parsedStartDate);
      setEndDate(parsedEndDate);
      form.setFieldsValue({
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      });
    }
  }, [data]);

  // console.log(startDate, endDate, "startenddate123241");

  const onFinish = (values) => {
    console.log(flashsaleProducts, "parsedStartDate");
    const products = flashsaleProducts.map((product: any) => {
      return {
        discountAmount: product?.discountAmount,
        discountType: product?.discountType,
        stock: product?.stock,
        ignorePlan: product?.ignorePlan,
        product: product?.product?.id,
      };
    });
    const data = {
      start: startDate,
      end: endDate,
      products,
    };
    mutate(data);
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout="vertical"
      className=" flex flex-col gap-4"
    >
      <div className="bg-white rounded-md p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Header title="Date & Time" />
        </div>
        <div className="flex gap-4">
          <Form.Item className="flex-[1] " name="startDate" label="Start Date">
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              className="w-full h-[48px]"
              onChange={(date, dateString) => {
                setStartDate(dateString);
              }}
            />
          </Form.Item>
          <Form.Item className="flex-[1] " name="endDate" label="End Date">
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              className="w-full h-[48px]"
              onChange={(date, dateString) => {
                setEndDate(dateString);
              }}
            />
          </Form.Item>
        </div>
      </div>

      <div className="bg-white rounded-md p-4  flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Header title="Product" />
          <div
            onClick={() => {
              setEditModalOpen(true);
            }}
            className="bg-[#F4F5F6] w-[40px] h-[40px] flex justify-center items-center rounded-[10px] cursor-pointer hover:bg-slate-200"
          >
            <img src={EditIcon} alt="" />
          </div>
        </div>
        <ReusableTable
          dataSource={flashsaleProducts}
          columns={flashsaleTable}
          pagination={false}
        />
      </div>
      <EditFlashSaleModal
        isModalOpen={editmodalOpen}
        setisModalOpen={setEditModalOpen}
        discountForm={form}
        dataSource={flashsaleProducts}
        seDataSource={setFlashsaleProducts}
      />

      <SubmitSection form={form} isLoading={mutationLoading} />
    </Form>
  );
}
