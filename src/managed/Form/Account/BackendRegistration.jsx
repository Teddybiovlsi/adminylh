import React, { useState } from "react";
import { FormGroup, Form, InputGroup } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import PageTitle from "../../../shared/Title";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Registration.module.scss";

export default function BackendRegistration() {
  const btn = new BtnBootstrap();

  const [email, setEmail] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [poorPassword, setPoorPassword] = useState(false);
  const [weakPassword, setWeakPassword] = useState(false);
  const [strongPassword, setStrongPassword] = useState(false);
  const [passwordError, setPasswordErr] = useState("");

  const handlePassword = (event) => {
    setPasswordInput(event.target.value);
  };

  const passwordStrength = (event) => {
    const passwordValue = event.target.value;
    const passwordLength = event.target.value;

    const poorRegExp = /[a-z]/;
    const weakRegExp = /(?=.*?[0-9])/;
    const strongRegExp = /(?=.*?[#?!@$%^&*-])/;
    const whitespaceRegExp = /^$|\s+/;

    const poorPassword = poorRegExp.test(passwordValue);
    const weakPassword = weakRegExp.test(passwordValue);
    const strongPassword = strongRegExp.test(passwordValue);
    const whiteSpace = whitespaceRegExp.test(passwordValue);

    if (passwordValue === "") {
      setPasswordErr("密碼欄位不得為空");
    } else {
      if (whiteSpace) {
        setPasswordErr("密碼欄位不得有空白鍵");
      }
      if (
        passwordLength <= 6 &&
        (poorPassword || weakPassword || strongPassword)
      ) {
        setPoorPassword(true);
        setPasswordErr("密碼強度為：弱");
      }
      if (
        passwordLength >= 8 &&
        poorPassword &&
        (weakPassword || strongPassword)
      ) {
        setWeakPassword(true);
        setPasswordErr("密碼強度為：中等");
      } else {
        setWeakPassword(false);
      }
      if (
        passwordLength >= 10 &&
        poorPassword &&
        weakPassword &&
        strongPassword
      ) {
        setStrongPassword(true);
        setPasswordErr("密碼強度為：強");
      } else {
        setStrongPassword(false);
      }
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
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <FormGroup>
                <Form.Label htmlFor="inputPassword">請輸入密碼：</Form.Label>
                <Form.Control
                  type="password"
                  id="inputPassword"
                  aria-describedby="passwordHelpBlock"
                />
                <Form.Text id="passwordHelpBlock" muted>
                  您的密碼長度至少要8-20字元以上，包含數字、英文組合。但不能包含空白或表情符號
                </Form.Text>
                <br />
                <Form.Label htmlFor="checkInputPassword">
                  請再次確認密碼：
                </Form.Label>
                <Form.Control
                  type="password"
                  id="checkInputPassword"
                  aria-describedby="passwordHelpBlock"
                />
              </FormGroup>

              <div className={`${styles.nextstep}`}>
                <btn.PrimaryBtn text={"送出"} />
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
