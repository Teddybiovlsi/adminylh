import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function AuthProtected({ user, redirectPath = "/", children }) {
  // const user = JSON.parse(localStorage?.getItem("user"));
  const nowTime = new Date();

  if (!user) {
    localStorage.getItem("manage") && localStorage.clear();
    sessionStorage.getItem("manage") && sessionStorage.clear();
    return <Navigate to="/" />;
  } else {
    if (new Date(user.expTime) < nowTime) {
      localStorage.getItem("manage") && localStorage.clear();
      sessionStorage.getItem("manage") && sessionStorage.clear();
      return <Navigate to={redirectPath} />;
    } else {
      // console.log("憑證未過期", user.expTime, nowTime);
      return children ?? <Outlet />;
    }
  }
}
