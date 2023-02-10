import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import UserLoginForm from "./client/UserLogin";
import ExamForm from "./managed/Form/Exam/CreateExamVideoForm";
import PageTitle from "./shared/Title";
// import PraticeForm from "./managed/components/CreatePraticeVideoForm";
// import ExamForm from "./managed/components/CreateExamVideoForm";

function App() {
  return (
    // <HashRouter>
    //   <Routes>
    //     <Route exact path="/" element={<UserLoginForm />} />
    //     <Route path="/Pratice" element={<PraticeForm />} />
    //     <Route path="/Exam" element={<ExamForm />} />
    //   </Routes>
    // </HashRouter>
    <>
      <ExamForm />
    </>
  );
}

export default App;
