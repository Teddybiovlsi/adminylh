import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Flip } from "react-toastify";

export default function ToastAlert({ ThemeMode = "light" }) {
  return (
    <ToastContainer
      position="top-right"
      transition={Flip}
      limit={1}
      autoClose={3000}
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
