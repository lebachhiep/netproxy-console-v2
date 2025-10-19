import { toast } from "sonner";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Đã sao chép mã giao dịch vào clipboard');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
