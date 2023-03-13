import React from "react";
import NavMenu from "./NavMenu";
import CreateVideoForm from "../Form/CreateVideoForm/CreateVideoForm";
import Footer from "./Footer";

function ExamForm() {
  return (
    <>
      <NavMenu />
      <CreateVideoForm VideoMode={false} />
      <Footer />
    </>
  );
}

export default ExamForm;
