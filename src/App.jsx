import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./managed/Header";
import Footer from "./managed/Footer";
import UserLoginForm from "./client/UserLogin";
import ExamForm from "./managed/components/ExamForm";
import CreateAdmin from "./managed/components/CreateAdmin";
import Home from "./managed/components/Home";
import PraticeForm from "./managed/components/PraticeForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/app.css"

function App() {
  return (
    // Routes 若有網址則如第一範例/Register前面須加上/#組合起來為/#/Register
    //  <Route exact path="/" element={<UserLoginForm />} />
    <div className="container">
      <Header />
      <main>
        <Routes>
          <Route path="/HomePage" element={<Home />} />
          <Route path="/Admin/Register" element={<CreateAdmin />} />
          <Route path="/Exam" element={<ExamForm />} />
          <Route path="/Pratice" element={<PraticeForm />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
