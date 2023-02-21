import React, { useEffect, useState } from "react";
import InputVideoFileFunction from "../shared/InputVideoFileFunction";
import InputVideoInfoFunction from "../shared/InputVideoInfoFunction";
import InputVideoQAFunction from "../shared/InputVideoQAFunction";
import "bootstrap/dist/css/bootstrap.min.css";

function CreateVideoForm(VideoMode = false) {
  const [videoSource, setVideoSource] = useState();

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

  const hadleVideoFileIsUpload = (e) => {
    if (e.target.files.length !== 0) {
      setFormType({
        ...formType,
        videoFile: e.target.files[0],
        videoFileName: e.target.files[0].name,
      });
      setVideoSource(URL.createObjectURL(e.target.files[0]));
    }
  };

  switch (formType.formStep) {
    case 1:
      return (
        <InputVideoFileFunction
          FormMode={VideoMode}
          ChangeEvent={hadleVideoFileIsUpload}
          VidoeName={formType.videoFileName}
          GoNextEvent={nextStep}
        />
      );
    case 2:
      return (
        <InputVideoInfoFunction
          FormMode={VideoMode}
          ChangeEvent={(e) => {
            setFormType({
              ...formType,
              videoLanguage: e.target.value,
            });
          }}
          VideoLanguage={formType.videoLanguage ? formType.videoLanguage : null}
          GoPrevEvent={prevStep}
          GoNextEvent={nextStep}
        />
      );
    case 3:
      return <InputVideoQAFunction FormMode={true} VideoFile={videoSource} />;
  }
}

export default CreateVideoForm;
