import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import UserLoginForm from "./client/UserLogin";
import CreateVideoForm from "./managed/Form/Exam/CreateVideoForm";
import BackendRegistration from "./managed/Form/Account/BackendRegistration";

function App() {
  return (
    // Routes 若有網址則如第一範例/Register前面須加上/#組合起來為/#/Register
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<UserLoginForm />} />
        <Route path="/Register" element={<BackendRegistration />} />
        <Route path="/Exam" element={<CreateVideoForm VideoMode={true} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
