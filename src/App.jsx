import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import UserLoginForm from "./client/UserLogin";
import ExamForm from "./managed/Form/Exam/CreateExamVideoForm";
import BackendRegistration from "./managed/Form/Account/BackendRegistration";

function App() {
  return (
    // Routes 若有網址則如第一範例/Register前面須加上/#組合起來為/#/Register
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<UserLoginForm />} />
        <Route path="/Register" element={<BackendRegistration />} />
        {/* <Route path="/Pratice" element={<PraticeForm />} />
        <Route path="/Exam" element={<ExamForm />} /> */}
      </Routes>
    </HashRouter>
    // <>
    //   <ExamForm />
    // </>
  );
}

export default App;
