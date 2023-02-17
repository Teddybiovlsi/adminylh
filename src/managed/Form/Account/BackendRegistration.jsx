import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Form, InputGroup } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Feedback from "react-bootstrap/Feedback";
import PageTitle from "../../../shared/Title";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useBoolean from "../shared/useBoolean";
import PwdStrengthMeter from "../shared/PwdStrengthMeter";
import styles from "./Registration.module.scss";
import zxcvbn from "zxcvbn";

export default function BackendRegistration() {
  // 實例化btn元件
  const btn = new BtnBootstrap();
  //email規則
  const emailRule =
    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

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

  // const validate = (values) => {
  //   let errors = {};
  //   if (!values.email) {
  //     errors.email = "Required";
  //   } else if (!emailRule.test(values)) {
  //     errors.email = "請輸入合法的email名稱";
  //   }
  //   return errors;
  // };

  const schema = yup.object({
    email: yup.string().email("請輸入合法的信箱").required("信箱欄位不得為空"),
  });

  const handlInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // const passwordStrength = (e) => {
  //   const passwordValue = e.target.value;
  //   const whitespaceRegExp = /^$|\s+/;
  //   const whiteSpace = whitespaceRegExp.test(passwordValue);

  //   if (passwordValue === "") {
  //     // setPasswordErr({
  //     //   ...passwordError,
  //     //   pwdError: "密碼欄位不得為空",
  //     // });
  //   } else {
  //     if (whiteSpace) {
  //       // setPasswordErr({
  //       //   ...passwordError,
  //       //   pwdError: "密碼欄位不得有空白鍵",
  //       // });
  //     } else {
  //       const pw = zxcvbn(passwordValue);
  //       setPwdScore(pw.score);
  //     }
  //   }
  // };

  // 驗證密碼
  // const validatePwd = (e) => {
  //   if (!e.target.value) {
  //     setPasswordErr({ ...passwordError, confirmPwdError: "請再次輸入密碼" });
  //   } else if (input.password && e.target.value !== input.password) {
  //     setPasswordErr({
  //       ...passwordError,
  //       confirmPwdError: "輸入密碼與再次確認密碼不符，請重新嘗試",
  //     });
  //   } else {
  //     setPasswordErr({
  //       ...passwordError,
  //       confirmPwdError: "",
  //     });
  //   }
  // };

  // const showEmailError = formik.touched.email && formik.errors.email;
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
            <Formik
              validationSchema={schema}
              onSubmit={console.log}
              initialValues={{
                email: "",
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                errors,
                isValid,
                isSubmitting,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label style={{ cursor: "pointer" }}>
                      請輸入Email：
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* <Form.Group className="mb-1">
                <Form.Label
                  htmlFor="inputPassword"
                  style={{ cursor: "pointer" }}
                >
                  請輸入密碼：
                </Form.Label>
                <InputGroup className="mb-1">
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
                <PwdStrengthMeter pwdScore={pwdScore} />
              </Form.Group>
              

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
              </Form.Group> */}
                  <div className="d-grid gap-2 mt-5">
                    <btn.PrimaryBtn text={"送出"} btnType={"submit"} />
                  </div>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
