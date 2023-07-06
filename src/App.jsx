import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  redirect,
  useNavigate,
} from "react-router-dom";
import Header from "./managed/Header";
import Footer from "./managed/Footer";
import UserLoginForm from "./client/UserLogin";
import BackendRegistration from "./managed/Form/BackendRegistration";
import FrontEndRegistration from "./managed/Form/FrontEndRegistration";
import Home from "./managed/Pages/Home";
import Pratice from "./managed/Pages/Pratice";
import Exam from "./managed/Pages/Exam";
import VideoPlayer from "./managed/Pages/VideoPlayer";
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
} from "react-google-recaptcha-v3";
import "./styles/app.css";
import ManageClientAccount from "./managed/Pages/ManageClientAccount";
import AboutUs from "./managed/Pages/AboutUs";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import MultiAddUser from "./managed/Pages/MultiAddUser";
import RestoreAccount from "./managed/Pages/RestoreAccount";
import EditClientVideoID from "./managed/Pages/EditClientVideoID";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import styles from "./styles/pages/NotFoundPage.module.scss";
import BtnBootstrap from "./components/BtnBootstrap";
import StatusCode from "./sys/StatusCode";
import { post } from "./managed/axios";
import ToastAlert from "./components/ToastAlert";
import { toast } from "react-toastify";
import { set } from "lodash/fp";

function App() {
  return (
    // Routes 若有網址則如第一範例/Register前面須加上/#組合起來為/#/Register
    //  <Route exact path="/" element={<UserLoginForm />} />
    // <GoogleReCaptchaProvider
    //   reCaptchaKey={import.meta.env.VITE_REACT_APP_SITE_KEY}
    // >
    <div className="app">
      <Header />
      <main className="app_main">
        <Routes>
          <Route index path="/" element={<LogInPage />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Admin/Register" element={<BackendRegistration />} />
          <Route path="/Client/Register" element={<FrontEndRegistration />} />
          <Route path="/Pratice" element={<Pratice />} />
          <Route path="/Exam" element={<Exam />} />
          <Route path="/Video" element={<VideoPlayer />} />
          <Route
            path="/ManageClientAccount"
            element={<ManageClientAccount />}
          />
          <Route path="/MultiAddUser" element={<MultiAddUser />} />
          <Route path="/MultiAddVideo" element={<EditClientVideoID />} />
          <Route path="/RestoreAccount" element={<RestoreAccount />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
    // </GoogleReCaptchaProvider>
  );
}

function LogInPage() {
  const [userInfo, setUserInfo] = useState({
    account: "",
    password: "",
    isRemember: false,
  });

  const [tempuser, setTempUser] = useState(null);
  let navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (form.checkValidity() === true) {
      event.preventDefault();
      fetchaLoginData(userInfo);
    }

    setValidated(true);
  };

  const fetchaLoginData = async (data) => {
    const clientSubmit = toast.loading("登入中...");
    try {
      const response = await post("admin/login", data);

      const userInfo = await response.data;

      setTempUser(userInfo);
      toast.update(clientSubmit, {
        render: "登入成功，3秒後將回到當前頁面",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.log(error.response.data);
      toast.update(clientSubmit, {
        render: `${error.response.data.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (tempuser !== null) {
      localStorage.setItem("user", JSON.stringify(tempuser));
    }
  }, [tempuser]);

  if (localStorage.getItem("user") == null) {
    return (
      <Container>
        <h1>歡迎光臨台大衛教後台管理系統</h1>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Col>
            <Form.Group as={Row} md="4" controlId="validationCustom01">
              <Form.Label>帳號</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="請輸入帳號"
                onChange={(e) => {
                  setUserInfo({ ...userInfo, account: e.target.value });
                }}
              />
              <Form.Control.Feedback type="invalid">
                請輸入帳號
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPwd">
              <Form.Label>密碼</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="請輸入密碼"
                onChange={(e) => {
                  setUserInfo({ ...userInfo, password: e.target.value });
                }}
                isInvalid={ErrorMessage.passwordErrorMessage}
              />
              <Form.Control.Feedback type="invalid">
                請輸入密碼
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
              <Col>
                <Form.Check
                  type="checkbox"
                  label="記住我"
                  className="mt-2"
                  id="remember"
                  value={userInfo.isRemember}
                  onClick={() => {
                    setUserInfo({
                      ...userInfo,
                      isRemember: !userInfo.isRemember,
                    });
                  }}
                />
              </Col>
              <Col>
                <BtnBootstrap
                  btnPosition="mt-2 float-end"
                  btnSize="md"
                  variant="primary"
                  btnType="submit"
                  text="登入"
                />
              </Col>
            </Row>
          </Col>
        </Form>
        <ToastAlert />
      </Container>
    );
  } else {
    redirect("/Home");
  }
}

function NotFoundPage() {
  return (
    <div className={`align-middle ${styles.notFoundContainer}`}>
      <h1>找不到此網頁</h1>
    </div>
  );
}

export default App;
