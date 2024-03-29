import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AuthProtected from "./AuthProtected";
import BackendRegistration from "./managed/Form/BackendRegistration";
import CreateBasicVideo from "./managed/Form/CreateBasicVideo";
import DetailBasicRecord from "./managed/Pages/ClientRecordDetail/DetailBasicRecord";
import EditClientBasicVideoQA from "./managed/Form/EditClientBasicVideoQA";
import EditVideoSource from "./managed/Pages/EditVideoSource";
import EditClientVideoID from "./managed/Pages/EditClientVideoID";
import EditClientVideoQA from "./managed/Form/EditClientVideoQA";
import EditVideoThumbnail from "./managed/Pages/EditVideoThumbnail";
import Exam from "./managed/Pages/Exam";
import FrontEndRegistration from "./managed/Form/FrontEndRegistration";
import Header from "./managed/Header";
import Home from "./managed/Pages/Home";
import LogIn from "./managed/Pages/LogIn";
import ManageAdminAccount from "./managed/Pages/ManageAdminAccount";
import ManageClientAccount from "./managed/Pages/ManageClientAccount";
import ManageClientRecord from "./managed/Pages/ManageClientRecord";
import MultiAddAdmin from "./managed/Pages/MultiAddAdmin";
import MultiAddUser from "./managed/Pages/MultiAddUser";
import Pratice from "./managed/Pages/Pratice";
import RestoreAccount from "./managed/Pages/RestoreAccount";
import RestoreAdminAccount from "./managed/Pages/RestoreAdminAccount";
import VideoPlayer from "./managed/Pages/VideoPlayer";
import VideoRecord from "./managed/Pages/VideoRecord";
import "./styles/app.css";
import styles from "./styles/pages/NotFoundPage.module.scss";
import { getAdminSession } from "./managed/js/manageAction";

function App() {
  const location = useLocation();

  const admin = getAdminSession();

  useEffect(() => {
    if (admin) {
    }
  }, [location]);

  return (
    // Routes 若有網址則如第一範例/Register前面須加上/#組合起來為/#/Register
    //  <Route exact path="/" element={<UserLoginForm />} />
    // <GoogleReCaptchaProvider
    //   reCaptchaKey={import.meta.env.VITE_REACT_APP_SITE_KEY}
    // >
    <div className="app">
      <Header admin={admin} />
      <main className="app_main">
        <Routes>
          <Route index path="/" element={<LogIn />} />
          <Route element={<AuthProtected user={admin} />}>
            <Route path="/Home" element={<Home admin={admin} />} />
            <Route path="/Admin/Register" element={<BackendRegistration />} />
            <Route path="/Admin/Edit/Video" element={<EditClientVideoQA />} />
            <Route
              path="/Admin/Edit/VideoSource"
              element={<EditVideoSource />}
            />

            <Route
              path="/Admin/Edit/Tumbnail"
              element={<EditVideoThumbnail />}
            />
            <Route
              path="/Admin/Edit/BasicVideo"
              element={<EditClientBasicVideoQA />}
            />
            <Route path="/Client/Register" element={<FrontEndRegistration />} />
            <Route path="/Basic/Video" element={<CreateBasicVideo />} />
            <Route path="/Pratice" element={<Pratice />} />
            <Route path="/Exam" element={<Exam />} />
            <Route
              path="/Record/:type"
              element={<VideoRecord admin={admin} />}
            />
            <Route
              path="/ClientRecord/:name/:videoName"
              element={<DetailBasicRecord />}
            />

            <Route path="/Video" element={<VideoPlayer />} />
            {/* 使用者管理 */}
            <Route
              path="/ManageClientAccount"
              element={<ManageClientAccount admin={admin} />}
            />
            <Route
              path="/ManagePraticeRecord"
              element={<ManageClientRecord />}
            />
            <Route path="/MultiAddUser" element={<MultiAddUser />} />
            <Route
              path="/MultiAddVideo"
              element={<EditClientVideoID admin={admin} />}
            />
            <Route path="/RestoreAccount" element={<RestoreAccount />} />
            {/* 管理端管理 */}
            <Route
              path="/ManageAdminAccount"
              element={<ManageAdminAccount admin={admin} />}
            />
            <Route path="/MultiAddAdmin" element={<MultiAddAdmin />} />
            <Route
              path="/RestoreAdminAccount"
              element={<RestoreAdminAccount admin={admin} />}
            />

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
