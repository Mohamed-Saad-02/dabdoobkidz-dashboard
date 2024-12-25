import { Form, Input, Select } from "antd";

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
 
    
    if (inputType === "select") {
      return (
        <td {...restProps}>
          {editing ? (
            <Form.Item
              name={dataIndex}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ]}
            >
              <Select>
                <Select.Option value="normal">Normal</Select.Option>
                <Select.Option value="premium">Premium</Select.Option>
              </Select>
            </Form.Item>
          ) : (
            children
          )}
        </td>
      );
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
           <Input />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };