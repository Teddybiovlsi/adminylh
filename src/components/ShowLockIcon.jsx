import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function ShowLockIcon({
  islock = 0,
  placement = "top",
  tooltipText = "Hello for tooltip",
}) {
  if (islock === 0) {
    return (
      <>
        <OverlayTrigger
          key={placement}
          placement={placement}
          overlay={<Tooltip id={`tooltip-${placement}`}>{tooltipText}</Tooltip>}
        >
          <i style={{ color: "Green" }} className="bi bi-unlock-fill"></i>
        </OverlayTrigger>
      </>
    );
  } else
    return (
      <>
        <OverlayTrigger
          key={placement}
          placement={placement}
          overlay={<Tooltip id={`tooltip-${placement}`}>{tooltipText}</Tooltip>}
        >
          <i style={{ color: "red" }} className="bi bi-lock-fill"></i>
        </OverlayTrigger>
      </>
    );
}
