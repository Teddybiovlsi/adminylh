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
import FormEmail from "../shared/FormEmail";
import FormPwd from "../shared/FormPwd";
import styles from "./scss/Registration.module.scss";
import zxcvbn from "zxcvbn";

export default function BackendRegistration() {
  // 實例化btn元件
  const btn = new BtnBootstrap();

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
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <FormEmail
                    ChangeEvent={handleChange}
                    BlurEvent={handleBlur}
                    EmailValue={values.email}
                    ValidCheck={touched.email && !errors.email}
                    InValidCheck={!!errors.email}
                    ErrorMessage={errors.email}
                  />
                  <FormPwd
                    SetStrengthMeter={true}
                    StrengthMeterPwdScore={pwdScore}
                    ChangeEvent={handleChange}
                    BlurEvent={handleBlur}
                    InputEvent={(e) => {
                      setPwdScore(zxcvbn(e.target.value).score);
                    }}
                    PwdValue={values.password}
                    ValidCheck={touched.password & !errors.password}
                    InValidCheck={!!errors.password}
                    ControlID={"inputPassword"}
                    IconID={"showPass"}
                    SetShowPwdCondition={setShowPwd}
                    ShowPwdCondition={showPwd}
                    ErrorMessage={errors.password}
                  />
                  <FormPwd
                    LabelForName="checkInputPassword"
                    ControlName="confirmPassword"
                    LabelMessage="請再次確認輸入密碼"
                    FormControlPlaceHolder={checkPwdHint}
                    BlurEvent={handleBlur}
                    ChangeEvent={handleChange}
                    PwdValue={values.confirmPassword}
                    SetShowPwdCondition={setShowPwd}
                    ShowPwdCondition={showPwd}
                    ValidCheck={
                      touched.confirmPassword & !errors.confirmPassword
                    }
                    InValidCheck={!!errors.confirmPassword}
                    CorrectMessage="確認密碼與輸入密碼相符"
                    ErrorMessage={errors.confirmPassword}
                  />
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
