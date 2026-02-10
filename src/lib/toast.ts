import { toast } from "react-hot-toast";

export const showToast = {
  success: (msg: string, duration?: number) =>
    toast.success(msg, duration ? { duration } : undefined),

  error: (msg: string, duration?: number) =>
    toast.error(msg, duration ? { duration } : undefined),

  loading: (msg: string, duration?: number) =>
    toast.loading(msg, duration ? { duration } : undefined),

  dismiss: () => toast.dismiss(),
};