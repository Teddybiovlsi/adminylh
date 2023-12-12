import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import PwdStrengthMeter from "../shared/PwdStrengthMeter";

function FormPwd({
  ControlGroupID = "passwordHelpBlock",
  SetStrengthMeter = false,
  StrengthMeterPwdScore = 0,
  GroupClassName = "mb-2",
  InputGroupClassName = "mb-1",
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
    <Form.Group className={GroupClassName} controlId={ControlGroupID}>
      <Form.Label style={{ cursor: "pointer" }}>{LabelMessage}</Form.Label>
      <InputGroup className={InputGroupClassName}>
        <Form.Control
          autoComplete="nope"
          type={ShowPwdCondition ? "Text" : "Password"}
          name={ControlName}
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
        <Form.Control.Feedback>{CorrectMessage}</Form.Control.Feedback>
        <Form.Control.Feedback type="invalid">
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
