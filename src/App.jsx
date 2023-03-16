import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./managed/Header";
import Footer from "./managed/Footer";
import UserLoginForm from "./client/UserLogin";
import BackendRegistration from "./managed/Form/BackendRegistration";
import Home from "./managed/components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/app.css";

import CreateVideo from "./managed/Form/CreateVideo";

function App() {
  return (
    // Routes 若有網址則如第一範例/Register前面須加上/#組合起來為/#/Register
    //  <Route exact path="/" element={<UserLoginForm />} />
    <div className="container">
      <Header />
      <main>
        <Routes>
          <Route path="/HomePage" element={<Home />} />
          <Route path="/Admin/Register" element={<BackendRegistration />} />
          <Route path="/Pratice" element={<CreateVideo VideoMode={false} />} />
          <Route path="/Exam" element={<CreateVideo VideoMode={true} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
