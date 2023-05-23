import React from "react";
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
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
} from "react-google-recaptcha-v3";
import "./styles/app.css";
import ManageClientAccount from "./managed/Pages/ManageClientAccount";

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
          <Route path="/" element={<Home />} />
          <Route path="/Admin/Register" element={<BackendRegistration />} />
          <Route path="/Client/Register" element={<FrontEndRegistration />} />
          <Route path="/Pratice" element={<Pratice />} />
          <Route path="/Exam" element={<Exam />} />
          <Route path="/Video" element={<VideoPlayer />} />
          <Route path="/ManageClientAccount" element={<ManageClientAccount />} />
        </Routes>
      </main>
      <Footer />
    </div>
    // </GoogleReCaptchaProvider>
  );
}

export default App;
