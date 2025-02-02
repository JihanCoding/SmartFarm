import Swal from "sweetalert2";

const CustomAlert = async ({
  title = "알림",
  text = "",
  icon = "info",
  showCancelButton = false,
  confirmButtonText = "확인",
  cancelButtonText = "취소",
  onConfirm = () => {},
  onCancel = () => {},
  heightAuto = false
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    heightAuto
  });

  if (result.isConfirmed) {
    onConfirm();
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    onCancel();
  }
};

export default CustomAlert;