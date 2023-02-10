import React from "react";
import {
  CreateVideoForm,
  SelectFormLanguage,
  InputFormQuestionNum,
} from "../../shared/form"

export const PraticeForm = () => {
  return (
    <>
      <SelectFormLanguage />
      <InputFormQuestionNum />
      <CreateVideoForm />
    </>
  );
};
export default PraticeForm;