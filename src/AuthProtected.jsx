import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthProtected({ user, redirectPath = "/", children }) {
  // const user = JSON.parse(localStorage?.getItem("user"));
  const nowTime = new Date();

  if (!user) {
    return <Navigate to="/" />;
  } else {
    if (new Date(user.expTime) < nowTime) {
      console.log("憑證過期");
      localStorage.removeItem("user");
      return <Navigate to={redirectPath} />;
    } else {
      console.log("憑證未過期", user.expTime, nowTime);
      return children ?? <Outlet />;
    }
  }
}
