import React from "react";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function ShowInfoIcon({
  placement = "top",
  btnAriaLabel = "",
  btnDisabled = false,
  btnOnclickEventName,
  btnSize = "sm",
  btnType = "button",
  btnVariant = "secondary",
  tooltipText = "Hello for tooltip",
  isInfoOrVideo = "info",
}) {
  return (
    <>
      <OverlayTrigger
        key={placement}
        placement={placement}
        overlay={<Tooltip id={`tooltip-${placement}`}>{tooltipText}</Tooltip>}
      >
        <Button
          className="ms-1"
          aria-label={btnAriaLabel}
          disabled={btnDisabled}
          onClick={btnOnclickEventName}
          size={btnSize}
          type={btnType}
          variant={btnVariant}
        >
          {isInfoOrVideo === "info" ? (
            <i className="bi bi-info-lg"></i>
          ) : (
            <i className="bi bi-play-btn"></i>
          )}
        </Button>
      </OverlayTrigger>
    </>
  );
}
