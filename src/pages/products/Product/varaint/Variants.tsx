import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Select, Switch } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { getOptions } from "../../../../api/options";
import { updateProduct } from "../../../../api/products";
import { uploadFile } from "../../../../api/upload";
import {
  addVaraint,
  deleteVariant,
  getVariants,
  updateVaraint,
} from "../../../../api/varaints";
import Header from "../../../../components/Header";
import Loading from "../../../../components/Loading";
import VaraintImageModal from "../../../../components/products/varaint/VaraintImageModal";
import openNotification from "../../../../components/ui/Notfication";
import ReusableTable from "../../../../components/ui/Table";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import { ApiError } from "../../../../types/ApiError";

export default function Variants() {
  const { id } = useParams<{ id: string }>();
  const [token] = useLocalStorage<string>("accessToken", "null");
  const { data: variants, isLoading: varaintsLoading } = useQuery(
    "varaints",
    () => {
      return getVariants(Number(id));
    }
  );

  const { data: options, isLoading: optionLoading } = useQuery(
    "variantOptions",
    () => {
      return getOptions(Number(id));
    }
  );
  const [data, setData] = useState(variants || []);
  const [optionsColumns, setOptionsColumns] = useState([{}]);
  const [currnetlyEditing, setCurrentlyEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [ModalOpen, setModalOpen] = useState<boolean>(false);
  const [varaintImages, setVaraintImages] = useState([]);
  const [oldVaraintImages, setOldVaraintImages] = useState([]);
  const [imageuploadloading, setImageUploadLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const mutationId = useRef(-1);
  const [form] = Form.useForm();
  const query = useQueryClient();
  console.log(varaintImages, "varaintImgstest");

  const hadnelFilterimages = (id) => {
    // if (currnetlyEditing === -1) {
    //   return;
    // }
    // setVaraintImages(
    //   variants
    //     ?.find((item) => item.id === id)
    //     ?.gallery.map((img) => {
    //       return {
    //         url: img,
    //       };
    //     }) || []
    // );
  };
  console.log(varaintImages, "selectedOptions");

  const { mutate: updataVaraintMutaio, isLoading: updataVaraintLoading } =
    useMutation((data) => updateVaraint(Number(id), currnetlyEditing, data), {
      onSuccess: () => {
        openNotification({
          message: "Variant Updated",
          type: "success",
          description: "Variant has been updated successfully",
        });
        query.invalidateQueries("varaints");
      },
      onError: (error: ApiError) => {
        openNotification({
          message: "Error",
          type: "error",
          description: "Something went wrong",
        });
      },
    });

  const { mutate: addVaraintMutation, isLoading: addVaraintLoading } =
    useMutation(
      (variantData) => {
        return addVaraint(id, variantData);
      },
      {
        onSuccess: () => {
          openNotification({
            message: "Variant Added",
            type: "success",
            description: "Variant has been added successfully",
          });
          query.invalidateQueries("varaints");
          mutationId.current--;
        },
        onError: (error: ApiError) => {
          // console.log(error.response?.data.errors[0]?.message, "error.response?.data.errors[0]?.message");

          openNotification({
            message: "Error",
            type: "error",
            description:
              error.response?.data.errors[0]?.message || "Something went wrong",
          });
        },
      }
    );

  useEffect(() => {
    if (!options) {
      return;
    }
    console.log("no options ", options);
    variants?.forEach((variant: any, index: any) => {
      form.setFieldsValue({
        [`stock[${variant.id}]`]: variant.stock,
        [`sku[${variant.id}]`]: variant.sku,
        [`isActive[${variant.id}]`]: variant.isActive,
        [`price[${variant.id}]`]: variant.price,
      });
      variant.options.forEach((option: any, optionIdx: any) => {
        console.log(option, "optioninloop");

        form.setFieldsValue({
          [`options[${variant.id}][${option?.option?.id}]`]: +option?.value?.id,
        });
      });
    });
  }, [variants, options]);

  // console.log(form.getFieldsValue(), "form.getFieldsValue()");

  const { mutate: deleteVaraintMutation, deleteVaraintLoading } = useMutation(
    (varaiantId) => {
      return deleteVariant(Number(id), varaiantId);
    },
    {
      onSuccess: () => {
        openNotification({
          message: "Variant Deleted",
          type: "success",
          description: "Variant has been deleted successfully",
        });
        query.invalidateQueries("varaints");
      },
      onError: (error: ApiError) => {
        openNotification({
          message: "Error",
          type: "error",
          description: "Something went wrong",
        });
      },
    }
  );
  useEffect(() => {
    if (variants) {
      setData(variants);
    }
    // setSelectedOptions(
    //   variants?.map((variant) => {
    //     return variant.options.map((option) => {
    //       return {
    //         id: option.id,
    //         value: option.value.id,
    //       };
    //     });
    //   }
    // )
    // );
  }, [variants]);

  useMemo(() => {
    variants?.forEach((variant: any, index: any) => {
      setVaraintImages((prev) => {
        return [
          ...prev,
          {
            id: variant.id,
            img: variant.gallery.map((img) => {
              return {
                url: img,
              };
            }),
          },
        ];
      });
    });
  }, [variants]);
  console.log(varaintImages, "sevariantImages");

  const onFinish = async (values) => {
    console.log(values, "valuesofvariant");

    options?.forEach((option, optionIdx) => {
      if (!values[`options[${currnetlyEditing}][${option?.id}]`]) {
        form.setFields([
          {
            name: `options[${currnetlyEditing}][${option?.id}]`,
            errors: ["Please select an option"],
          },
        ]);
      } else {
        form.setFields([
          {
            name: `options[${currnetlyEditing}][${option?.id}]`,
            errors: [],
          },
        ]);
      }
    });
    if (!values[`stock[${currnetlyEditing}]`]) {
      form.setFields([
        {
          name: `stock[${currnetlyEditing}]`,
          errors: ["Please input your stock!"],
        },
      ]);
    } else {
      form.setFields([
        {
          name: `stock[${currnetlyEditing}]`,
          errors: [],
        },
      ]);
    }
    if (!values[`sku[${currnetlyEditing}]`]) {
      form.setFields([
        {
          name: `sku[${currnetlyEditing}]`,
          errors: ["Please input your sku!"],
        },
      ]);
    } else {
      form.setFields([
        {
          name: `sku[${currnetlyEditing}]`,
          errors: [],
        },
      ]);
    }
    if (!values[`price[${currnetlyEditing}]`]) {
      form.setFields([
        {
          name: `price[${currnetlyEditing}]`,
          errors: ["Please input your price!"],
        },
      ]);
    } else {
      form.setFields([
        {
          name: `price[${currnetlyEditing}]`,
          errors: [],
        },
      ]);
    }
    console.log(varaintImages, "varaintImages");

    // if (varaintImages.length === 0) {
    //   form.setFields([
    //     {
    //       name: `image[${currnetlyEditing}]`,
    //       errors: ["Please select an image"],
    //     },
    //   ]);
    // } else {
    //   form.setFields([
    //     {
    //       name: `image[${currnetlyEditing}]`,
    //       errors: [],
    //     },
    //   ]);
    // }

    const notValid = form
      .getFieldsError()
      .some((item) => item.errors.length > 0);
    if (notValid) {
      return;
    }

    let newImages = varaintImages;

    if (varaintImages.every((image) => !image.originFileObj)) {
      // No new images, use existing ones
      newImages =
        variants
          .find((variant) => variant.id === currnetlyEditing)
          ?.gallery.map((img) => img) || [];
    } else {
      const newImagesPromise = varaintImages.map(async (image) => {
        if (!image.originFileObj) return image.url; // Skip old images
        const formData = new FormData();
        formData.append("file", image.originFileObj);
        const imagesUrl = await uploadFile(
          image.originFileObj,
          token,
          image.originFileObj?.name
        );
        return imagesUrl;
      });

      setImageUploadLoading(true);
      newImages = await Promise.all(newImagesPromise).catch((error) => {
        openNotification({
          message: "Error Uploading Images",
          type: "error",
          description: "The image could be too large",
        });
      });
      setImageUploadLoading(false);
    }
    console.log(newImages, "newImages");

    const allImages = [...newImages];
    setImageUploadLoading(false);
    const formattedOptions = options?.map((option, optionIdx) => {
      console.log(
        values[`options[${currnetlyEditing}][${option?.id}]`],
        "varaintoptionValue"
      );
      return {
        value: values[`options[${currnetlyEditing}][${option?.id}]`],
      };
    });

    console.log(formattedOptions, "formattedOptions");
    console.log(currnetlyEditing, mutationId, "currnetlyEditing");

    if (currnetlyEditing === mutationId.current) {
      setIsAdding(false);
      const data = {
        sku: values[`sku[${mutationId.current}]`],
        stock: +values[`stock[${mutationId.current}]`],
        isActive: values[`isActive[${mutationId.current}]`] || false,
        price: +values[`price[${mutationId.current}]`],
        gallery: allImages,
        options: formattedOptions,
      };
      addVaraintMutation(data);
    } else {
      setIsAdding(false);

      const data = {
        sku: values[`sku[${currnetlyEditing}]`],
        stock: +values[`stock[${currnetlyEditing}]`],
        isActive: values[`isActive[${currnetlyEditing}]`] || false,
        price: +values[`price[${currnetlyEditing}]`],
        gallery: allImages,
        options: formattedOptions,
      };

      console.log(data, "dataofvariant");

      updataVaraintMutaio(data);
    }
  };

  useEffect(() => {
    if (options) {
      const optIonsColumnsinit = options?.map((option, optionIdx) => {
        return {
          title: option.name,
          key: option.id,
          render: (record, index: number) => {
            const items = option.values.map((value) => {
              return {
                label: value.value,
                value: +value.id,
              };
            });

            console.log(record, "varaintselectItemyyyyyyy");

            return (
              <Form.Item
                name={`options[${record.id}][${option?.id}]`}
                // initialValue={{

                // }}
                // rules={[{ required: true, message: "Please select an option" }]}
              >
                <Select
                  style={{ width: 100 }}
                  // defaultValue={
                  //   record?.options.find((item) => item.option.id === option.id)?.value?.value
                  // }

                  options={items}
                >
                  {/* {option.values.map((value) => (
                    <Select.Option value={value?.id}>
                      {value?.value}
                    </Select.Option>
                  ))} */}
                </Select>
              </Form.Item>
            );
          },
        };
      });
      setOptionsColumns(optIonsColumnsinit);
    }
  }, [options]);

  const SwitchComponent = ({ id, isActive }: any) => {
    const { mutate } = useMutation(() => {
      return updateProduct(id, { isActive: !isActive });
    });
    return (
      <Form.Item name={`isActive[${id}]`} valuePropName="checked">
        <Switch
          checkedChildren={<CheckCircleFilled />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked={isActive}
          onChange={() => {
            if (id === -1) {
              return;
            }

            mutate();
          }}
        />
      </Form.Item>
    );
  };
  const ActionsComponent = ({ id }: any) => {
    return (
      <>
        <div className="flex gap-4">
          <Form.Item>
            <Button
              loading={
                (updataVaraintLoading ||
                  addVaraintLoading ||
                  imageuploadloading) &&
                currnetlyEditing === id
              }
              type="text"
              className="text-primary border border-primary"
              onClick={() => {
                setCurrentlyEditing(id);

                hadnelFilterimages(id);
                form.submit();
              }}
            >
              Save
            </Button>
          </Form.Item>
          <Form.Item name={`images`}>
            <Button
              type="text"
              className="text-primary border border-primary"
              onClick={() => {
                setModalOpen(true);
                setCurrentlyEditing(id);
                hadnelFilterimages(id);
              }}
            >
              Add Image
            </Button>
          </Form.Item>
          <Form.Item>
            {id !== -1 && (
              <DeleteOutlined
                className="text-[32px] text-red-500"
                onClick={() => {
                  deleteVaraintMutation(id);
                }}
              />
            )}
          </Form.Item>

          <Form.Item>
            {id === mutationId.current && (
              <CloseCircleFilled
                className="text-[32px] text-red-500"
                onClick={() => {
                  setData((prev) => {
                    return prev.filter((item) => item.id !== id);
                  });
                  setCurrentlyEditing(null);
                  setIsAdding(false);
                }}
              >
                Cancel
              </CloseCircleFilled>
            )}
          </Form.Item>
        </div>
      </>
    );
  };
  if (optionLoading || varaintsLoading) {
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  const VaraintTable = [
    {
      title: "IMAGE",
      render: (record: { images: string[]; id: number }) => {
        return (
          <Form.Item name={`image[${record.id}]`}>
            {!variants?.find((item) => item.id === record?.id)?.gallery[0] ? (
              <img
                src="https://via.placeholder.com/150"
                alt="product"
                style={{ width: "50px", height: "50px" }}
              />
            ) : (
              <img
                src={
                  variants?.find((item) => item.id === record?.id)?.gallery[0]
                }
                alt="product"
                style={{ width: "50px", height: "50px" }}
              />
            )}
          </Form.Item>
        );
      },
      key: "image",
    },

    ...optionsColumns,
    {
      title: "Stock",
      render: (record: { stock: string; id: number }) => {
        return (
          <Form.Item
            name={`stock[${record.id}]`}
            // rules={[{ required: true, message: "Please input your stock!" }]}
          >
            <Input className="w-[120px]" />
          </Form.Item>
        );
      },
    },
    {
      title: "SKU",
      render: (record: { sku: string; id: number }) => {
        return (
          <Form.Item
            name={`sku[${record.id}]`}
            // rules={[{ required: true, message: "Please input your sku!" }]}
          >
            <Input className="w-[120px]" />
          </Form.Item>
        );
      },
      key: "sku",
    },
    {
      title: "Price",
      render: (record: { price: string; id: number }) => {
        return (
          <Form.Item
            name={`price[${record.id}]`}
            // rules={[{ required: true, message: "Please input your sku!" }]}
          >
            <Input className="w-[120px]" />
          </Form.Item>
        );
      },
      key: "sku",
    },
    {
      title: "Status",
      render: (record: { id: number; isActive: boolean }) => (
        <SwitchComponent id={record.id} isActive={record.isActive} />
      ),
    },
    {
      title: "Action",
      fixed: "right",
      render: (record: { id: number }) => <ActionsComponent id={record.id} />,
      key: `action${id}`,
    },
  ];

  return (
    <div className="flex flex-col justify-between">
      <div className="bg-white p-4 flex flex-col gap-6 rounded-md">
        <div className="flex justify-between">
          <Header title="Variants" />
          <Button
            disabled={isAdding}
            onClick={() => {
              setIsAdding(true);
              setData((prev) => {
                return [
                  ...prev,
                  {
                    id: mutationId.current,
                    images: "",
                    options: ["", ""],
                    stock: "",
                    isActive: false,
                    sku: "",
                  },
                ];
              });
            }}
            icon={<PlusOutlined />}
            type="primary"
          >
            Add Variant
          </Button>
        </div>

        <Form form={form} onFinish={onFinish}>
          <ReusableTable
            columns={VaraintTable}
            dataSource={data}
            scroll={{ x: "1200px" }}
          />
        </Form>
      </div>
      <VaraintImageModal
        isModalOpen={ModalOpen}
        setIsModalOpen={setModalOpen}
        setVaraintImages={setVaraintImages}
        setOldVaraintImages={setOldVaraintImages}
        variantImages={varaintImages}
        oldVariantImages={oldVaraintImages}
        varaintId={currnetlyEditing}
      />
    </div>
  );
}
