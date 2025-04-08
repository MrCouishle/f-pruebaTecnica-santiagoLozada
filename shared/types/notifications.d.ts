type NotificationParams = {
  type: "info" | "success" | "warning" | "error" | null;
  title: string | null;
  message: string | null;
};

type CallNotification = (params: NotificationParams) => void;
type OffNotification = () => void;
