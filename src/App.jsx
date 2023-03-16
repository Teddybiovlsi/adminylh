import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import UserLoginForm from "./client/UserLogin";
import ExamForm from "./managed/components/ExamForm";
import CreateAdmin from "./managed/components/CreateAdmin";
import Home from "./managed/components/Home";
import PraticeForm from "./managed/components/PraticeForm";
import NavMenu from "./managed/components/NavMenu";

function App() {
  return (
    // Routes 若有網址則如第一範例/Register前面須加上/#組合起來為/#/Register
    //  <Route exact path="/" element={<UserLoginForm />} />
    <div className="container">
      <NavMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<CreateAdmin />} />
        <Route path="/Exam" element={<ExamForm />} />
        <Route path="/Pratice" element={<PraticeForm />} />
      </Routes>
    </div>
  );
}

export default App;
