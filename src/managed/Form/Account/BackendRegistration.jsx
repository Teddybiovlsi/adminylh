import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import PageTitle from "../../../shared/Title";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useBoolean from "../shared/useBoolean";
import PwdStrengthMeter from "../shared/PwdStrengthMeter";
import styles from "./Registration.module.scss";
import zxcvbn from "zxcvbn";

export default function BackendRegistration() {
  const btn = new BtnBootstrap();
  const pwdHint =
    "您的密碼長度至少要8-20字元以上，包含數字、英文組合。但不能包含空白";
  const checkPwdHint = "請再次輸入您的密碼";
  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [confirmPwdError, setConfirmPwdError] = useState("");
  const [pwdScore, setPwdScore] = useState(0);
  const [showPwd, { setShowPwd }] = useBoolean(false);

  // useEffect(() => {
  //   switch (pwdScore) {
  //     case 0:
  //       setPasswordErr({
  //         ...passwordError,
  //         pwdError: "密碼強度為：極弱 無法通過註冊",
  //       });
  //       break;
  //     case 1:
  //       setPasswordErr({ ...passwordError, pwdError: "密碼強度為：偏弱" });
  //       break;
  //     case 2:
  //       setPasswordErr({ ...passwordError, pwdError: "密碼強度為：普通" });
  //       break;
  //     case 3:
  //       setPasswordErr({ ...passwordError, pwdError: "密碼強度為：強" });
  //       break;
  //     case 4:
  //       setPasswordErr({ ...passwordError, pwdError: "密碼強度為：最強" });
  //       break;
  //     default:
  //       setPasswordErr({ ...passwordError });
  //   }
  // }, [pwdScore]);

  const handlInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const passwordStrength = (e) => {
    const passwordValue = e.target.value;
    const whitespaceRegExp = /^$|\s+/;
    const whiteSpace = whitespaceRegExp.test(passwordValue);

    if (passwordValue === "") {
      // setPasswordErr({
      //   ...passwordError,
      //   pwdError: "密碼欄位不得為空",
      // });
    } else {
      if (whiteSpace) {
        // setPasswordErr({
        //   ...passwordError,
        //   pwdError: "密碼欄位不得有空白鍵",
        // });
      } else {
        const pw = zxcvbn(passwordValue);
        setPwdScore(pw.score);
      }
    }
  };
  // 驗證密碼
  const validatePwd = (e) => {
    if (!e.target.value) {
      setPasswordErr({ ...passwordError, confirmPwdError: "請再次輸入密碼" });
    } else if (input.password && e.target.value !== input.password) {
      setPasswordErr({
        ...passwordError,
        confirmPwdError: "輸入密碼與再次確認密碼不符，請重新嘗試",
      });
    } else {
      setPasswordErr({
        ...passwordError,
        confirmPwdError: "",
      });
    }
  };

  return (
    <>
      <PageTitle title="台大分院雲林分院｜創建後台使用者" />
      <div className="FormStyle d-flex align-items-center justify-content-center">
        <Card className={`${styles.ExamCard}`}>
          <Card.Title className={`${styles.FormTitle}`}>
            <h1>
              <strong>台大醫院雲林分院 創建後台使用者</strong>
            </h1>
          </Card.Title>
          <Card.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label style={{ cursor: "pointer" }}>
                  請輸入Email：
                </Form.Label>
                <Form.Control
                  required
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  onChange={handlInputChange}
                  value={input.email}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-1">
                <Form.Label
                  htmlFor="inputPassword"
                  style={{ cursor: "pointer" }}
                >
                  請輸入密碼：
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPwd ? "Text" : "Password"}
                    name="password"
                    id="inputPassword"
                    maxLength={20}
                    aria-describedby="passwordHelpBlock"
                    placeholder={pwdHint}
                    onChange={handlInputChange}
                    onInput={passwordStrength}
                    value={input.password}
                    required
                  />
                  <span className="input-group-text">
                    <FontAwesomeIcon
                      id="showPass"
                      style={{ cursor: "pointer" }}
                      onClick={setShowPwd}
                      icon={showPwd ? faEyeSlash : faEye}
                    />
                  </span>
                </InputGroup>
              </Form.Group>
              <PwdStrengthMeter pwdScore={pwdScore} />

              <Form.Group>
                <Form.Label
                  htmlFor="checkInputPassword"
                  style={{ cursor: "pointer" }}
                >
                  請確認輸入密碼：
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPwd ? "Text" : "Password"}
                    name="confirmPassword"
                    id="checkInputPassword"
                    onChange={handlInputChange}
                    onBlur={validatePwd}
                    value={input.confirmPassword}
                    placeholder={checkPwdHint}
                    aria-describedby="passwordHelpBlock"
                    required
                  />
                  <span className="input-group-text">
                    <FontAwesomeIcon
                      id="showConfirmPass"
                      style={{ cursor: "pointer" }}
                      onClick={setShowPwd}
                      icon={showPwd ? faEyeSlash : faEye}
                    />
                  </span>
                </InputGroup>
              </Form.Group>
              <div className="d-grid gap-2 mt-5">
                <btn.PrimaryBtn text={"送出"} type={"submit"} />
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
