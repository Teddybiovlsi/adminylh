import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export default function BtnBootstrapwithSpinner({
  ariaLabelName,
  btnClassName,
  btnID,
  btnName,
  btnSize,
  btnTitle,
  btnType,
  ifIsLoading,
  loadingText = "載入中...",
  onClickEventName,
  text = "送出",
  variant,
}) {
  return (
    <Button
      id={btnID}
      name={btnName}
      size={btnSize}
      className={btnClassName}
      type={btnType}
      variant={variant}
      onClick={onClickEventName}
      disabled={ifIsLoading}
      title={btnTitle}
      aria-label={ariaLabelName}
    >
      {ifIsLoading && (
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      )}
      {ifIsLoading ? loadingText : text}
    </Button>
  );
}
