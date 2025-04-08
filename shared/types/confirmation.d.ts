interface ConfirmationData {
  title: string;
  message: string;
  active: boolean;
  ok: (() => void) | null;
  cancel: (() => void) | null;
  type: "info" | "succes" | "error" | "warning";
}

type CloseConfirmation = () => void;
