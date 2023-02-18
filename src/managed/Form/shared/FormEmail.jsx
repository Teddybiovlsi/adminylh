import React, { Component } from "react";
import { Form } from "react-bootstrap";


function FormEmail({
  GroupClassName = "mb-3",
  LabelClassName = "fs-3",
  FeedBackClassName = "fs-5",
  ControlName = "email",
  ChangeEvent,
  BlurEvent,
  EmailValue = "",
  ValidCheck,
  InValidCheck,
  FormControlPlaceHolder = "name@example.com",
  LabelMessage = "請輸入Email:",
  CorrectMessage = "信箱格式輸入正確",
  ErrorMessage = "",
}) {
  return (
    <Form.Group
      className={GroupClassName}
      controlId="exampleForm.ControlInput1"
    >
      <Form.Label className={LabelClassName} style={{ cursor: "pointer" }}>
        {LabelMessage}
      </Form.Label>
      <Form.Control
        type="email"
        name={ControlName}
        placeholder={FormControlPlaceHolder}
        onChange={ChangeEvent}
        onBlur={BlurEvent}
        value={EmailValue}
        isValid={ValidCheck}
        isInvalid={!!InValidCheck}
      />
      {/* 格式正確訊息 */}
      <Form.Control.Feedback className={FeedBackClassName}>
        {CorrectMessage}
      </Form.Control.Feedback>
      {/* 格式錯誤訊息 */}
      <Form.Control.Feedback type="invalid" className={FeedBackClassName}>
        {ErrorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export default FormEmail;
