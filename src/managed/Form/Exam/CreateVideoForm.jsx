import React, { useState } from "react";
import InputVideoFileFunction from "../shared/InputVideoFileFunction";
import "bootstrap/dist/css/bootstrap.min.css";

function CreateVideoForm(VideoMode = false) {
  const [formType, setFormType] = useState({
    Type: { VideoMode },
    formStep: 1,
    videoFile: "",
    videoFileName: "",
    videoLanguage: "",
    questionNum: 1,
  });
  const prevStep = (e) => {
    setFormType({ ...formType, [e.target.name]: formType.formStep - 1 });
  };

  const nextStep = (e) => {
    setFormType({ ...formType, [e.target.name]: formType.formStep + 1 });
  };

  switch (formType.formStep) {
    case 1:
      return (
        <InputVideoFileFunction
          FormMode={VideoMode}
          ChangeEvent={(e) => {
            setFormType({
              ...formType,
              videoFile: e.target.files[0],
              videoFileName: e.target.files[0].name,
            });
          }}
          VidoeName={formType.videoFileName}
          GoNextEvent={nextStep}
        />
      );
    case 2:
      return (
        // <InputVideoFileFunction
        //   FormMode={VideoMode}
        //   ChangeEvent={(e) => {
        //     setFormType({
        //       ...formType,
        //       videoFile: e.target.files[0],
        //       videoFileName: e.target.files[0].name,
        //     });
        //   }}
        //   VidoeName={formType.videoFileName}
        //   GoNextEvent={nextStep}
        // />
        <h1>測試</h1>
      );
  }
  // return <div></div>;
}

export default CreateVideoForm;
