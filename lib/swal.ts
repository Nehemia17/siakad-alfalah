import Swal from "sweetalert2";

const CustomSwal = Swal.mixin({
  customClass: {
    popup:
      "rounded-xl border border-slate-200 bg-white p-6 shadow-lg font-sans",
    title: "text-lg font-semibold text-slate-900",
    htmlContainer: "text-sm text-slate-600",
    confirmButton:
      "bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors mx-1",
    cancelButton:
      "bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors mx-1",
  },
  buttonsStyling: false,
});

export const showSuccessToast = (message: string) => {
  return CustomSwal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
};

export const showErrorAlert = (title: string, message: string) => {
  return CustomSwal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonText: "Mengerti",
  });
};

export const showConfirmDelete = async (itemName: string): Promise<boolean> => {
  const result = await CustomSwal.fire({
    title: "Konfirmasi Penghapusan",
    text: `Data "${itemName}" akan dihapus permanen dari sistem. Aksi ini tidak dapat dibatalkan.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus Data",
    cancelButtonText: "Batal",
    reverseButtons: true,
  });
  return result.isConfirmed;
};
