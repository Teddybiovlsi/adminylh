import React from "react";
import { Form, FloatingLabel } from "react-bootstrap";

function FormEmail({
  GroupClassName = "mb-2",
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
    <Form.Group className={GroupClassName} controlId="floatingEmail">
      <Form.Label className={LabelClassName} style={{ cursor: "pointer" }}>
        {LabelMessage}
      </Form.Label>
      <FloatingLabel
        controlId="floatingEmail"
        label="Email address"
        className="mb-3"
      >
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
      </FloatingLabel>
    </Form.Group>
  );
}

export default FormEmail;
