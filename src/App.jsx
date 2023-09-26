import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  redirect,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "./managed/Header";
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
import ManageClientAccount from "./managed/Pages/ManageClientAccount";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import MultiAddUser from "./managed/Pages/MultiAddUser";
import RestoreAccount from "./managed/Pages/RestoreAccount";
import EditClientVideoID from "./managed/Pages/EditClientVideoID";

import AuthProtected from "./AuthProtected";
import EditClientVideoQA from "./managed/Form/EditClientVideoQA";
import "./styles/app.css";
import styles from "./styles/pages/NotFoundPage.module.scss";
import LogIn from "./managed/Pages/LogIn";
import ManageClientRecord from "./managed/Pages/ManageClientRecord";

function App() {
  const location = useLocation();
  const user = JSON.parse(
    localStorage?.getItem("manage") || sessionStorage?.getItem("manage")
  );

  useEffect(() => {
    if (user) {
    }
  }, [location]);

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
          <Route index path="/" element={<LogIn />} />
          <Route element={<AuthProtected user={user} />}>
            <Route path="/Home" element={<Home />} />
            <Route path="/Admin/Register" element={<BackendRegistration />} />
            <Route path="/Admin/Edit/Video" element={<EditClientVideoQA />} />
            <Route path="/Client/Register" element={<FrontEndRegistration />} />
            <Route path="/Pratice" element={<Pratice />} />
            <Route path="/Exam" element={<Exam />} />
            <Route path="/Video" element={<VideoPlayer />} />
            <Route
              path="/ManageClientAccount"
              element={<ManageClientAccount />}
            />
            <Route
              path="/ManagePraticeRecord"
              element={<ManageClientRecord />}
            />
            <Route path="/MultiAddUser" element={<MultiAddUser />} />
            <Route path="/MultiAddVideo" element={<EditClientVideoID />} />
            <Route path="/RestoreAccount" element={<RestoreAccount />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </main>
    </div>
    // </GoogleReCaptchaProvider>
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
