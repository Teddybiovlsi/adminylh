import React, { useState } from "react";
import InputVideoFileFunction from "../shared/InputVideoFileFunction";
import InputVideoInfoFunction from "../shared/InputVideoInfoFunction";
import InputVideoQAFunction from "../shared/InputVideoQAFunction";
import InputFormPreviewFunction from "../shared/InputFormPreviewFunction";
import "bootstrap/dist/css/bootstrap.min.css";

function CreateVideoForm({ VideoMode = false }) {
  const [videoInfo, setVideoInfo] = useState([
    {
      currentTime: 0,
      mustCorrectQuestion: false,
      questionContent: "",
      numofOptions: 0,
      answerContent: [],
    },
  ]);

  const [formType, setFormType] = useState({
    Type: { VideoMode },
    formStep: 1,
    videoFile: "",
    videoSource: "",
    videoFileName: "",
    videoLanguage: "",
    questionNum: 1,
  });

  const hadleVideoFileIsUpload = (e) => {
    if (e.target.files.length !== 0) {
      setFormType({
        ...formType,
        videoFile: e.target.files[0],
        videoFileName: e.target.files[0].name,
        videoSource: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const prevStep = (e) => {
    setFormType({ ...formType, [e.target.name]: formType.formStep - 1 });
  };

  const nextStep = (e) => {
    setFormType({ ...formType, [e.target.name]: formType.formStep + 1 });
  };

  const submitAction = () => {
    console.log(`${formType}-${videoInfo} `);
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
      return (
        <InputVideoQAFunction
          FormMode={VideoMode}
          FormStep={formType.formStep}
          VideoFile={formType.videoSource}
          VideoQA={videoInfo}
          setVideoQA={setVideoInfo}
          GoPrevEvent={prevStep}
          GoNextEvent={nextStep}
        />
      );
    case 4:
      return (
        <InputFormPreviewFunction
          FormMode={VideoMode}
          VideoName={formType.videoFileName}
          VideoLanguage={formType.videoLanguage}
          VideoQA={videoInfo}
          GoPrevEvent={prevStep}
          SubmitEvent={submitAction}
        />
      );
    default:
      return;
  }
}

export default CreateVideoForm;
