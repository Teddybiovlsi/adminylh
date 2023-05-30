import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function ShowVideoIcon({
  haveVideo = 0,
  placement = "top",
  tooltipText = "Hello for tooltip",
}) {
  if (haveVideo === 1) {
    return (
      <>
        <OverlayTrigger
          key={placement}
          placement={placement}
          overlay={<Tooltip id={`tooltip-${placement}`}>{tooltipText}</Tooltip>}
        >
          <i style={{ color: "Green" }} class="bi bi-camera-video-fill"></i>
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
          <i style={{ color: "red" }} class="bi bi-camera-video-off-fill"></i>
        </OverlayTrigger>
      </>
    );
}
