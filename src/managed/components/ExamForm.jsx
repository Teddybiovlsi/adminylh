import React from "react";
import NavMenu from "./NavMenu";
import CreateVideoForm from "../Form/CreateVideoForm/CreateVideoForm";

function ExamForm() {
  return (
    <>
      <NavMenu />
      <CreateVideoForm VideoMode={true} />
    </>
  );
}

export default ExamForm;
