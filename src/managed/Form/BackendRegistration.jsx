// 建立後台使用者元件
// 包含email認證/密碼驗證/2次密碼驗證
// 送出後台使用者資料到API
// 顯示成功訊息/錯誤訊息
// 若傳送成功，5秒後自動跳轉回到首頁

import React, { useEffect, useState } from "react";
import { Col, Container, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import Card from "react-bootstrap/Card";
import PageTitle from "../../components/Title";
import BtnBootstrap from "../../components/BtnBootstrap";
import useBoolean from "./shared/useBoolean";
import FormEmail from "./shared/FormEmail";
import FormPwd from "./shared/FormPwd";
import AlertBootstrap from "../../components/AlertBootstrap";
import zxcvbn from "zxcvbn";
import { post } from "../axios";
import styles from "../../styles/Form/Registration.module.scss";
import { useNavigate } from "react-router-dom";
import StatusCode from "../../sys/StatusCode";
import FormAccount from "./shared/FormAccount.jsx";
import PageTitleHeading from "../../components/PageTitleHeading";

export default function BackendRegistration() {
  const checkPwdHint = "請再次輸入您的密碼";

  const [pwdScore, setPwdScore] = useState(0);
  const [showPwd, { setShowPwd }] = useBoolean(false);

  // 若註冊成功，則顯示成功訊息
  const [successMessage, setSuccessMessage] = useState("");
  // 若註冊失敗，則顯示錯誤訊息
  const [errorMessage, setErrorMessage] = useState("");

  const [successBoolean, setSuccessBoolean] = useState(false);

  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    // redirect to Home page after 5 seconds
    if (shouldRedirect) {
      return navigate("/");
    }
  }, [shouldRedirect]);

  // create a async function to send data to backend
  const sendBackendRegistrationData = async (data, resetForm) => {
    try {
      // 正確格式API
      const response = await post("admin", data);
      // if errorMessage is not empty, then unset it
      {
        errorMessage && setErrorMessage("");
      }
      setSuccessMessage("成功創建");
      setSuccessBoolean(true);
      resetForm();
      // redirect to Home page after 5 seconds
      setTimeout(() => {
        setShouldRedirect(true);
      }, 5000);
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        setErrorMessage("連線逾時，請稍後再試");
      } else {
        setErrorMessage(StatusCode(error.response.status));
      }
    }
  };

  const schema = yup.object({
    account: yup.string().required("帳號欄位不得為空"),
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
      {/* 使用自訂Alert元件 */}
      {successMessage || errorMessage ? (
        <AlertBootstrap
          ifsucceed={successBoolean}
          variant={successMessage ? "success" : "danger"}
          children={successMessage ? successMessage : errorMessage}
        />
      ) : (
        ""
      )}
      <PageTitleHeading text="創建後台使用者" styleOptions={4} />
      <Container>
        <Formik
          validationSchema={schema}
          onSubmit={(data, { resetForm }) => {
            //call sendBackendRegistrationData function and check if it is successful
            sendBackendRegistrationData(data, resetForm);
          }}
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
              <Form.Group className="mb-3" controlId="formNewManageMail">
                <Form.Label>請輸入電子郵件(email)：</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="請於此輸入電子郵件(email)"
                  onChange={handleChange}
                  value={values.email}
                  isInvalid={!!errors.email}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2" controlId="formNewManageAccount">
                <Form.Label>請輸入帳號：</Form.Label>
                <Form.Control
                  name="account"
                  type="text"
                  aria-describedby="accountHelpBlock"
                  placeholder="請在此處輸入帳號"
                  onChange={handleChange}
                  value={values.account}
                  isInvalid={!!errors.account}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.account}
                </Form.Control.Feedback>
              </Form.Group>
              <FormPwd
                GroupClassName="mb-1"
                SetStrengthMeter={true}
                StrengthMeterPwdScore={pwdScore}
                ChangeEvent={handleChange}
                BlurEvent={handleBlur}
                InputEvent={(e) => {
                  setPwdScore(zxcvbn(e.target.value).score);
                }}
                PwdValue={values.password}
                ValidCheck={touched.password && !errors.password}
                InValidCheck={touched.password && errors.password}
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
                ValidCheck={touched.confirmPassword && !errors.confirmPassword}
                InValidCheck={touched.confirmPassword && errors.confirmPassword}
                CorrectMessage="確認密碼與輸入密碼相符"
                ErrorMessage={errors.confirmPassword}
              />
              <div className="d-grid gap-2">
                <Col className="d-grid gap-2">
                  <BtnBootstrap
                    btnPosition=""
                    variant="outline-primary"
                    btnSize="md"
                    btnType={"submit"}
                    text={"送出"}
                  />
                </Col>
              </div>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
}
