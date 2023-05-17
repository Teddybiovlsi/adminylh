import React from "react";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function ToolTipBtn({
  placement = "top",
  btnAriaLabel = "",
  btnDisabled = false,
  btnOnclickEventName,
  btnSize = "sm",
  btnText = "",
  btnType = "button",
  btnVariant = "secondary",
  tooltipText = "Hello for tooltip",
}) {
  return (
    <>
      <OverlayTrigger
        key={placement}
        placement={placement}
        overlay={<Tooltip id={`tooltip-${placement}`}>{tooltipText}</Tooltip>}
      >
        <Button
          aria-label={btnAriaLabel}
          disabled={btnDisabled}
          onClick={btnOnclickEventName}
          size={btnSize}
          type={btnType}
          variant={btnVariant}
        >
          {btnText}
        </Button>
      </OverlayTrigger>
    </>
  );
}
