// Notification.tsx
import { notification } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface OpenNotificationProps {
  type: NotificationType;
  message: string;
  description?: string;
  placement?: NotificationPlacement;
}

const openNotification = ({
  type,
  message,
  description ,
  placement = 'topRight',
}: OpenNotificationProps) => {
  notification[type]({
    message,
    description,
    placement,
  });
};

export default openNotification;
