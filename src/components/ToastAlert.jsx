import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Flip } from "react-toastify";

export default function ToastAlert({
  ThemeMode = "light",
  position = "top-right",
  autocloseTime = 3000,
}) {
  return (
    <ToastContainer
      position={position}
      transition={Flip}
      limit={1}
      autoClose={autocloseTime}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={ThemeMode}
    />
  );
}
