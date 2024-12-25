import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteOption, getOptions } from "../../../../api/options";
import EmptyComponent from "../../../../components/common/Empty";
import Header from "../../../../components/Header";
import Loading from "../../../../components/Loading";
import openNotification from "../../../../components/ui/Notfication";
import { ApiError } from "../../../../types/ApiError";

export default function Options() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { data: options, isLoading: optionsLoading } = useQuery(
    "options",
    () => {
      return getOptions(Number(id));
    }
  );
  const query = useQueryClient();
  const { mutate: deleteOptionMutation } = useMutation(
    (optionId) => deleteOption(Number(id), optionId),
    {
      onSuccess: () => {
        openNotification({
          type: "success",
          message: "Option deleted",
          description: "Option has been deleted successfully",
        });
        query.invalidateQueries("options");
      },
      onError: (error: ApiError) => {
        openNotification({
          type: "error",
          message: "Error Deleting Option",
          description: error?.response?.data?.message || "Something went wrong",
        });
      },
    }
  );

  if (optionsLoading) {
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );
  }
  if (options?.length === 0) {
    return (
      <EmptyComponent
        text="options"
        description="
        Product variety refers to the number and range of products (differentiated by specifications) offered by sellers. And also product variety is beneficial for consumers because they can choose from a variety of alternatives.
      "
        link={`/add-option/${id}`}
      />
    );
  }
  return (
    <div className="flex flex-col bg-white p-4 gap-4 rounded-[10px]">
      <div className="flex justify-between">
        <Header title="Options" />
        <Button
          onClick={() => navigate(`/add-option/${id}`)}
          icon={<PlusOutlined />}
          type="primary"
        >
          Add Option
        </Button>
      </div>
      {options?.map((option) => {
        return (
          <div
            key={option.id}
            className="flex justify-between p-4 border-y-[1px] border-[#E4E7EC]"
          >
            <div className="flex gap-[32px]">
              <div className="flex gap-2 items-center">
                <span className="text-[20px] font-[600] ">=</span>
                <span className="text-[20px] font-[600]">{option.name}</span>
              </div>
              <div className="flex gap-6">
                {option.values.map((value) => {
                  return (
                    <span className="border rounded-[32px] border-[#E2E3E6] py-[2px] px-[22px]">
                      {value.value}
                    </span>
                  );
                })}
              </div>
            </div>
            <Dropdown
              dropdownRender={(menu) => (
                <Menu>
                  <Menu.Item key="0">
                    <Link to={`/edit-option/${id}/${option.id}`}>Edit</Link>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      deleteOptionMutation(option.id);
                    }}
                    key="1"
                  >
                    Delete
                  </Menu.Item>
                </Menu>
              )}
              trigger={["click"]}
            >
              <MoreOutlined style={{ cursor: "pointer" }} />
            </Dropdown>
          </div>
        );
      })}
    </div>
  );
}
