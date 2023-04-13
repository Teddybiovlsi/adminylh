import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import BtnBootstrap from "./BtnBootstrap";

export default function AlertBootstrap({
  ifsucceed = false,
  variant,
  children,
}) {
  const [show, setShow] = useState(true);

  const [countDownSeconds, setCountDownSeconds] = useState(5);
  useEffect(() => {
    // 設計倒數計時器，若ifsucceed為true，則在5秒後關閉alert
    if (ifsucceed) {
      const timer =
        countDownSeconds > 0 &&
        setInterval(() => setCountDownSeconds(countDownSeconds - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countDownSeconds, ifsucceed]);
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
        {ifsucceed ? `${countDownSeconds}秒後將回到主頁面` : ""}
      </Alert>
    );
  }
}
