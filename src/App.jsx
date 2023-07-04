import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
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
import { Button, Container, Form, Row } from "react-bootstrap";
import styles from "./styles/pages/NotFoundPage.module.scss";

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
          {/* <Route path="/" element={<Home />} /> */}
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
  const [user, setUser] = useState(null);
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <Container>
      <h1>LogIn</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Row>
            <Form.Label>帳號</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Row>
          <Row>
            <Button
              variant="primary"
              type="submit"
              onClick={() => {
                setUser("admin");
              }}
            >
              Submit
            </Button>
          </Row>
        </Form.Group>
      </Form>
    </Container>
  );
}

function NotFoundPage() {
  return (
    <div className={`align-middle ${styles.notFoundContainer}`}>
      <h1>找不到此網頁</h1>
    </div>
  );
}

export default App;
