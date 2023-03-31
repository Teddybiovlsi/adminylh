import React, { useState } from "react";
import { Alert } from "react-bootstrap";

export default function AlertBootstrap({
  ifsucceed = false,
  variant,
  children,
}) {
  const [show, setShow] = useState(true);
  // if show is false, then the alert will not be rendered
  if (!show) {
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
          {ifsucceed ? "發生了一些錯誤" : "成功！"}{" "}
        </Alert.Heading>
        {children}
      </Alert>
    );
  }
}
