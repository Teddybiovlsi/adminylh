import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import BtnBootstrap from "./BtnBootstrap";

export default function AlertBootstrap({
  ifsucceed = false,
  variant,
  children,
}) {
  const [show, setShow] = useState(true);

  const seconds = 5;

  // useEffect(() => {
    // when ifsucceed is true, then redirect to Home page after 5 seconds
    // and the second will be counted down
    // if(seconds >)
    //   seconds = seconds - 1;
    // }, [ifsucceed]);
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
        {ifsucceed ? "秒後將回到主頁面" : ""}
      </Alert>
    );
  }
}
