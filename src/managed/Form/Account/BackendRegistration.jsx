import React, { useEffect, useState } from "react";
import { FormGroup, Form, InputGroup } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import PageTitle from "../../../shared/Title";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Registration.module.scss";
import zxcvbn from "zxcvbn";
import { func } from "prop-types";

export default function BackendRegistration() {
  const btn = new BtnBootstrap();

  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordErr] = useState({
    pwdError:
      "您的密碼長度至少要8-20字元以上，包含數字、英文組合。但不能包含空白或表情符號",
    confirmPwdError: "",
  });

  const handlInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const passwordStrength = (e) => {
    let pwdScore = 0;

    const passwordValue = e.target.value;
    const whitespaceRegExp = /^$|\s+/;
    const whiteSpace = whitespaceRegExp.test(passwordValue);

    if (passwordValue === "") {
      setPasswordErr({
        ...passwordError,
        pwdError: "密碼欄位不得為空",
      });
    } else {
      if (whiteSpace) {
        setPasswordErr({
          ...passwordError,
          pwdError: "密碼欄位不得有空白鍵",
        });
      } else {
        setPasswordErr({
          ...passwordError,
          pwdError: "",
        });
        const pw = zxcvbn(passwordValue);
        pwdScore = pw.score;
        switch (pwdScore) {
          case 1:
            setPasswordErr({ ...passwordError, pwdError: "密碼強度為：極弱" });
            break;
          case 2:
            setPasswordErr({ ...passwordError, pwdError: "密碼強度為：偏弱" });
            break;
          case 3:
            setPasswordErr({ ...passwordError, pwdError: "密碼強度為：普通" });
            break;
          case 4:
            setPasswordErr({ ...passwordError, pwdError: "密碼強度為：強" });
            break;
          case 5:
            setPasswordErr({ ...passwordError, pwdError: "密碼強度為：極強" });
            break;
        }
      }
    }
  };
  const validatePwd = (e) => {
    if (!e.target.value) {
      setPasswordErr({ ...passwordError, confirmPwdError: "請再次輸入密碼" });
    } else if (input.password && e.target.value !== input.password) {
      setPasswordErr({
        ...passwordError,
        confirmPwdError: "輸入密碼與再次確認密碼不符，請重新嘗試",
      })
    }else{
      setPasswordErr({
        ...passwordError,
        confirmPwdError: "",
      })
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
                <Form.Label>請輸入Email：</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  onChange={handlInputChange}
                  value={input.email}
                />
              </Form.Group>
              <FormGroup>
                <Form.Label htmlFor="inputPassword">請輸入密碼：</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  id="inputPassword"
                  maxLength={20}
                  aria-describedby="passwordHelpBlock"
                  onChange={handlInputChange}
                  onInput={passwordStrength}
                  value={input.password}
                />
                <Form.Text id="passwordHelpBlock" muted>
                  <strong>{passwordError.pwdError}</strong>
                </Form.Text>
                <br />
                <Form.Label htmlFor="checkInputPassword">
                  請確認輸入密碼：
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  id="checkInputPassword"
                  onChange={handlInputChange}
                  onBlur={validatePwd}
                  value={input.confirmPassword}
                  aria-describedby="passwordHelpBlock"
                />
              </FormGroup>
              <div className="d-grid gap-2 mt-5">
                <btn.PrimaryBtn text={"送出"} />
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
