import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import BtnBootstrap from "./BtnBootstrap";

export default function AlertBootstrap({
  ifsucceed = false,
  variant,
  children,
}) {
  const [show, setShow] = useState(true);
  // if show is false, then the alert will not be rendered
  if (show) {
    return (
      <Alert
        key={variant}
        variant={variant}
        onClose={() => {
          setShow(false);
        }}
        dismissible
      >
        <Alert.Heading>
          {ifsucceed ? "成功！" : "發生了一些錯誤"}{" "}
        </Alert.Heading>
        {children}
        {ifsucceed ? "5秒後將回到主頁面" : ""}
      </Alert>
    );
  }
}
