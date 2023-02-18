import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Form, InputGroup } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import PageTitle from "../../../shared/Title";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useBoolean from "../shared/useBoolean";
import PwdStrengthMeter from "../shared/PwdStrengthMeter";
import styles from "./scss/Registration.module.scss";
import zxcvbn from "zxcvbn";

export default function BackendRegistration() {
  // 實例化btn元件
  const btn = new BtnBootstrap();

  const pwdHint =
    "密碼長度至少要8-20字元以上，包含數字、英文組合。但不能包含空白";
  const checkPwdHint = "請再次輸入您的密碼";

  const [pwdScore, setPwdScore] = useState(0);
  const [showPwd, { setShowPwd }] = useBoolean(false);

  const schema = yup.object({
    email: yup.string().email("請輸入合法的信箱").required("信箱欄位不得為空"),
    password: yup
      .string()
      .required("密碼欄位不得為空")
      .test("是否為中等強度密碼", "密碼強度不足，請試著多加特殊符號", () => {
        return pwdScore > 0;
      }),
    confirmPassword: yup
      .string()
      .required("再次確認密碼欄位不得為空!")
      .oneOf([yup.ref("password"), null], "前後密碼必須一致"),
  });

  return (
    <>
      <PageTitle title="台大分院雲林分院｜創建後台使用者" />
      <div className="FormStyle d-flex align-items-center justify-content-center">
        <Card className={`${styles.RegisterCard}`}>
          <Card.Title className={`${styles.FormTitle}`}>
            <h1 className="fs-2">
              <strong>創建後台使用者</strong>
            </h1>
          </Card.Title>
          <Card.Body>
            <Formik
              validationSchema={schema}
              onSubmit={console.log}
              initialValues={{
                email: "",
                password: "",
                confirmPassword: "",
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
                isValid,
                isSubmitting,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label className="fs-3" style={{ cursor: "pointer" }}>
                      請輸入Email：
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      isValid={touched.email && !errors.email}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback className="fs-5">
                      信箱格式輸入正確
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid" className="fs-5">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-1">
                    <Form.Label
                      htmlFor="inputPassword"
                      className="fs-3"
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
                        placeholder={"請在這裡輸入密碼"}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onInput={(e) => {
                          setPwdScore(zxcvbn(e.target.value).score);
                        }}
                        value={values.password}
                        isValid={touched.password & !errors.password}
                        isInvalid={!!errors.password}
                      />
                      <span className="input-group-text">
                        <FontAwesomeIcon
                          id="showPass"
                          style={{ cursor: "pointer" }}
                          onClick={setShowPwd}
                          icon={showPwd ? faEyeSlash : faEye}
                        />
                      </span>
                      <Form.Control.Feedback className="fs-5">
                        密碼格式輸入正確
                      </Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid" className="fs-5">
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <PwdStrengthMeter pwdScore={pwdScore} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label
                      htmlFor="checkInputPassword"
                      className="fs-3"
                      style={{ cursor: "pointer" }}
                    >
                      請確認輸入密碼：
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPwd ? "Text" : "Password"}
                        name="confirmPassword"
                        id="checkInputPassword"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirmPassword}
                        placeholder={checkPwdHint}
                        aria-describedby="passwordHelpBlock"
                        isValid={touched.confirmPassword & !errors.confirmPassword}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <span className="input-group-text">
                        <FontAwesomeIcon
                          id="showConfirmPass"
                          style={{ cursor: "pointer" }}
                          onClick={setShowPwd}
                          icon={showPwd ? faEyeSlash : faEye}
                        />
                      </span>
                      <Form.Control.Feedback className="fs-5">
                        確認密碼與輸入密碼相符
                      </Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid" className="fs-5">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <div className={`${styles.btnPosition} d-grid gap-2 p-2`}>
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
