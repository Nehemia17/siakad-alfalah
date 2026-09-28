import Swal from "sweetalert2";

const baseSwalStyles = `
  .swal-custom-popup {
    border-radius: 16px !important;
    border: 1px solid #e2e8f0 !important;
    background: #ffffff !important;
    padding: 24px !important;
    box-shadow: 0 20px 60px -12px rgba(0, 0, 0, 0.15) !important;
    font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  }
  .swal-custom-title {
    font-size: 1.125rem !important;
    font-weight: 600 !important;
    color: #0f172a !important;
  }
  .swal-custom-html {
    font-size: 0.875rem !important;
    color: #64748b !important;
  }
  .swal-btn-confirm {
    background-color: #1B4332 !important;
    color: #ffffff !important;
    padding: 10px 20px !important;
    border-radius: 8px !important;
    font-weight: 500 !important;
    font-size: 0.875rem !important;
    transition: background-color 0.2s !important;
    margin: 0 4px !important;
    border: none !important;
  }
  .swal-btn-confirm:hover {
    background-color: #143326 !important;
  }
  .swal-btn-cancel {
    background-color: #f1f5f9 !important;
    color: #475569 !important;
    padding: 10px 20px !important;
    border-radius: 8px !important;
    font-weight: 500 !important;
    font-size: 0.875rem !important;
    transition: background-color 0.2s !important;
    margin: 0 4px !important;
    border: none !important;
  }
  .swal-btn-cancel:hover {
    background-color: #e2e8f0 !important;
  }
  .swal-btn-delete {
    background-color: #dc2626 !important;
    color: #ffffff !important;
    padding: 10px 20px !important;
    border-radius: 8px !important;
    font-weight: 500 !important;
    font-size: 0.875rem !important;
    transition: background-color 0.2s !important;
    margin: 0 4px !important;
    border: none !important;
  }
  .swal-btn-delete:hover {
    background-color: #b91c1c !important;
  }
`;

function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("swal-custom-styles")) return;
  const style = document.createElement("style");
  style.id = "swal-custom-styles";
  style.textContent = baseSwalStyles;
  document.head.appendChild(style);
}

const CustomSwal = Swal.mixin({
  customClass: {
    popup: "swal-custom-popup",
    title: "swal-custom-title",
    htmlContainer: "swal-custom-html",
    confirmButton: "swal-btn-confirm",
    cancelButton: "swal-btn-cancel",
  },
  buttonsStyling: false,
  didOpen: () => injectStyles(),
});

export const showSuccessToast = (message: string) => {
  injectStyles();
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
  injectStyles();
  return CustomSwal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonText: "Mengerti",
  });
};

export const showConfirmDelete = async (itemName: string): Promise<boolean> => {
  injectStyles();
  const result = await Swal.fire({
    title: "Konfirmasi Penghapusan",
    text: `Data "${itemName}" akan dihapus permanen dari sistem. Aksi ini tidak dapat dibatalkan.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus Data",
    cancelButtonText: "Batal",
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: "swal-custom-popup",
      title: "swal-custom-title",
      htmlContainer: "swal-custom-html",
      confirmButton: "swal-btn-delete",
      cancelButton: "swal-btn-cancel",
    },
  });
  return result.isConfirmed;
};
