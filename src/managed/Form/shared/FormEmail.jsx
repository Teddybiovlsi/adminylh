import React from "react";

function FormEmail(
  GroupClassName = "mb-3",
  GroupControlID = "exampleForm.ControlInput1",
  LabelClassName = "fs-3",
  FeedBackClassName = "fs-5",
  ChangeEvent = null,
  BlurEvent = null,
  EmailValue = null,
  InValidCheck = null,
  ErrorMessage = null
) {
  return (
    <Form.Group className={GroupClassName} controlId={GroupControlID}>
      <Form.Label className={LabelClassName} style={{ cursor: "pointer" }}>
        請輸入Email：
      </Form.Label>
      <Form.Control
        type="email"
        name="email"
        placeholder="name@example.com"
        onChange={ChangeEvent}
        onBlur={BlurEvent}
        value={EmailValue}

        isInvalid={!!InValidCheck}
      />

      <Form.Control.Feedback type="invalid" className={FeedBackClassName}>
        {ErrorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export default FormEmail;
