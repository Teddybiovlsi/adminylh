import React, { Component } from "react";
import Button from "react-bootstrap/Button";

export class BtnBootstrap extends Component {
  PrimaryBtn = ({
    btnName = "",
    btnPosition = "float-end",
    btnType = "button",
    eventName,
    text,
    disabled,
  }) => {
    return (
      <Button
        name={btnName}
        size="lg"
        className={btnPosition}
        type={btnType}
        variant="outline-primary"
        onClick={eventName}
        disabled={disabled}
      >
        {text}
      </Button>
    );
  };

  Secondary = ({
    btnID = "",
    btnPosition = "float-end",
    btnType = "button",
    eventName,
    text,
    disabled,
  }) => {
    return (
      <Button
        id={btnID}
        size="lg"
        className={btnPosition}
        type={btnType}
        variant="outline-secondary"
        onClick={eventName}
        disabled={disabled}
      >
        {text}
      </Button>
    );
  };
  Success = ({
    btnPosition = "float-end",
    onClickEventName,
    text,
    disabled,
  }) => {
    return (
      <Button
        size="lg"
        className={btnPosition}
        variant="outline-success"
        onClick={onClickEventName}
        disabled={disabled}
      >
        {text}
      </Button>
    );
  };

  Danger = ({
    btnName = "",
    btnPosition = "float-end",
    onClickEventName,
    text,
    disabled,
  }) => {
    return (
      <Button
        name={btnName}
        size="lg"
        className={btnPosition}
        variant="outline-danger"
        onClick={onClickEventName}
        disabled={disabled}
      >
        {text}
      </Button>
    );
  };
  Warning = ({
    btnPosition = "float-end",
    onClickEventName,
    text,
    disabled,
  }) => {
    return (
      <Button
        size="lg"
        className={btnPosition}
        variant="outline-warning"
        onClick={onClickEventName}
        disabled={disabled}
      >
        {text}
      </Button>
    );
  };
}

export default BtnBootstrap;
