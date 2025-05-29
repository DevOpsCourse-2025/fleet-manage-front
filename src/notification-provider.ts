import type { NotificationProvider } from "@refinedev/core";
import { toast } from "sonner";

export const notificationProvider: NotificationProvider = {
  open: ({
    message,
    description,
    key,
    type,
    cancelMutation,
    undoableTimeout,
  }) => {
    switch (type) {
      case "success":
      case "error":
        toast(message, {
          dismissible: true,
          closeButton: true,
          id: key,
          description,
        });
        break;
      case "progress":
        toast(message, {
          id: key,
          dismissible: false,
          description: "Please wait...",
          action:
            undoableTimeout ?? 0 > 0
              ? {
                  label: "Undo",
                  onClick: () => cancelMutation?.(),
                }
              : undefined,
        });
        break;
    }
  },
  close: (key) => {
    toast.dismiss(key);
  },
};
