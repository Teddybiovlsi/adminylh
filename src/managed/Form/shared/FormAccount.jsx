import React from "react";
import { Form } from "react-bootstrap";

export default function FormAccount({
  AccountValue = "",
  AccountPlaceholder = "請輸入帳號",
  ChangeEvent,
  BlurEvent,
  CorrectMessage = "帳號格式輸入正確",
  ErrorMessage = "",
  FeedBackClassName = "fs-5",
  GroupClassName = "mb-2",
  InValidCheck,
  LabelClassName = "fs-3",
  LabelMessage = "請輸入帳號：",
  ValidCheck,
}) {
  return (
    <Form.Group className={GroupClassName}>
      <Form.Label
        htmlFor="inputAccount"
        className={LabelClassName}
        style={{ cursor: "pointer" }}
      >
        {LabelMessage}
      </Form.Label>
      <Form.Control
        name="account"
        type="text"
        id="inputAccount"
        aria-describedby="accountHelpBlock"
        placeholder={AccountPlaceholder}
        onChange={ChangeEvent}
        onBlur={BlurEvent}
        value={AccountValue}
        isValid={ValidCheck}
        isInvalid={!!InValidCheck}
      />
      <Form.Control.Feedback className={FeedBackClassName}>
        {CorrectMessage}
      </Form.Control.Feedback>
      <Form.Control.Feedback type="invalid" className={FeedBackClassName}>
        {ErrorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
