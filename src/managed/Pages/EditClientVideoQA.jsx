import React from "react";
import { useLocation, Navigate } from "react-router-dom";

export default function EditClientVideoQA() {
  if (!useLocation().state) {
    return <Navigate to="/" />;
  }

  const location = useLocation();

  console.log(location.state);

  return <div></div>;
}
