import React, { Component } from "react";
import Button from "react-bootstrap/Button";

export class BtnBootstrap extends Component {
  PrimaryBtn = ({ BtnPosition = "float-end", EventName, Text, disabled }) => {
    return (
      <Button
        size="lg"
        className={BtnPosition}
        variant="outline-primary"
        onClick={EventName}
        disabled={disabled}
      >
        {Text}
      </Button>
    );
  };

  Secondary = ({ BtnPosition = "float-end", EventName, Text, disabled }) => {
    return (
      <Button
        size="lg"
        className={BtnPosition}
        variant="outline-secondary"
        onClick={EventName}
        disabled={disabled}
      >
        {Text}
      </Button>
    );
  };
  Success = ({
    BtnPosition = "float-end",
    onClickEventName,
    Text,
    disabled,
  }) => {
    return (
      <Button
        size="lg"
        className={BtnPosition}
        variant="outline-success"
        onClick={onClickEventName}
        disabled={disabled}
      >
        {Text}
      </Button>
    );
  };

  Danger = ({
    BtnPosition = "float-end",
    onClickEventName,
    Text,
    disabled,
  }) => {
    return (
      <Button
        size="lg"
        className={BtnPosition}
        variant="outline-danger"
        onClick={onClickEventName}
        disabled={disabled}
      >
        {Text}
      </Button>
    );
  };
  Warning = ({
    BtnPosition = "float-end",
    onClickEventName,
    Text,
    disabled,
  }) => {
    return (
      <Button
        size="lg"
        className={BtnPosition}
        variant="outline-warning"
        onClick={onClickEventName}
        disabled={disabled}
      >
        {Text}
      </Button>
    );
  };
}

export default BtnBootstrap;
