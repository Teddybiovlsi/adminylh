import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import PwdStrengthMeter from "../shared/PwdStrengthMeter";

function FormPwd({
  SetStrengthMeter = false,
  StrengthMeterPwdScore = 0,
  PwdMaxLength = 20,
  GroupClassName = "mb-2",
  LabelClassName = "fs-3",
  InputGroupClassName = "mb-1",
  FeedBackClassName = "fs-5",
  LabelForName = "inputPassword",
  ControlName = "password",
  ChangeEvent = null,
  BlurEvent = null,
  InputEvent = null,
  PwdValue = "",
  ValidCheck = null,
  InValidCheck = null,
  LabelMessage = "請輸入密碼：",
  IconID = "",
  FormControlPlaceHolder = "請在這裡輸入密碼",
  SetShowPwdCondition,
  ShowPwdCondition,
  CorrectMessage = "密碼格式輸入正確",
  ErrorMessage = "",
}) {
  return (
    <Form.Group className={GroupClassName}>
      <Form.Label
        htmlFor={LabelForName}
        className={LabelClassName}
        style={{ cursor: "pointer" }}
      >
        {LabelMessage}
      </Form.Label>
      <InputGroup className={InputGroupClassName}>
        <Form.Control
          type={ShowPwdCondition ? "Text" : "Password"}
          name={ControlName}
          id={LabelForName}
          maxLength={PwdMaxLength}
          aria-describedby="passwordHelpBlock"
          placeholder={FormControlPlaceHolder}
          onChange={ChangeEvent}
          onBlur={BlurEvent}
          onInput={InputEvent}
          value={PwdValue}
          isValid={ValidCheck}
          isInvalid={InValidCheck}
        />
        <span className="input-group-text">
          <FontAwesomeIcon
            id={IconID}
            style={{ cursor: "pointer" }}
            onClick={SetShowPwdCondition}
            icon={ShowPwdCondition ? faEyeSlash : faEye}
          />
        </span>
        <Form.Control.Feedback className={FeedBackClassName}>
          {CorrectMessage}
        </Form.Control.Feedback>
        <Form.Control.Feedback type="invalid" className={FeedBackClassName}>
          {ErrorMessage}
        </Form.Control.Feedback>
      </InputGroup>
      {SetStrengthMeter ? (
        <PwdStrengthMeter pwdScore={StrengthMeterPwdScore} />
      ) : null}
    </Form.Group>
  );
}

export default FormPwd;
