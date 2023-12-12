import React from "react";
import { Form, FloatingLabel } from "react-bootstrap";

export default function FormIdentity({
  GroupClassName = "mb-2",
  LabelClassName = "fs-5",
  FeedBackClassName = "fs-5",
  ControlName = "",
  ChangeEvent,
  BlurEvent,
  TextValue = "",
  maxLens = 10,
  ValidCheck,
  InValidCheck,
  FormControlPlaceHolder = "ya12345",
  LabelMessage = "請輸入病歷號:",
  CorrectMessage = "病歷號格式正確",
  ErrorMessage = "",
  componentID = "IdentityInput",
  componentLableText = "請輸入用戶病歷號",
}) {
  return (
    <Form.Group className={GroupClassName} controlId={componentID}>
      <Form.Label className={LabelClassName} style={{ cursor: "pointer" }}>
        {LabelMessage}
      </Form.Label>
      <FloatingLabel controlId={componentID} label={componentLableText}>
        <Form.Control
          type="text"
          name={ControlName}
          placeholder={FormControlPlaceHolder}
          onChange={ChangeEvent}
          onBlur={BlurEvent}
          value={TextValue}
          maxLength={maxLens}
          isValid={ValidCheck}
          isInvalid={InValidCheck}
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
