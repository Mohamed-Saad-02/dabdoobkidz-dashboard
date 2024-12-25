import { Modal } from "antd";
import Header from "../Header";

type ModalProps = {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  children?: React.ReactNode;
  title?: string;
  width?: string;
  footer? :[],
  okloading?: boolean;
};

export default function ModalComponent({
  isModalOpen,
  handleOk,
  handleCancel,
  children,
  title,
  width,
  footer,
  okloading,
}: ModalProps) {
  return (
    <Modal
      width={width}
      title={<Header title={title ?? ""} />}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      onClose={handleCancel}
      footer = {footer ? footer : null}
      okButtonProps={{
        loading  : okloading
      }}
    >
      {children}
    </Modal>
  );
}
