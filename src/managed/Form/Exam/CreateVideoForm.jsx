import React, { useContext, useEffect, useRef, useState } from "react";
import InputVideoFileFunction from "../shared/InputVideoFileFunction";
import InputVideoInfoFunction from "../shared/InputVideoInfoFunction";
import InputVideoQAFunction from "../shared/InputVideoQAFunction";
import "bootstrap/dist/css/bootstrap.min.css";

function CreateVideoForm(VideoMode = false) {
  // const [currentTime, setCurrentTime] = useState(0);
  // const [videoInfo, setVideoInfo] = useState([{ currentTime: 0 }]);
  const [videoInfo, setVideoInfo] = useState([
    { currentTime: 0, mustCorrectQuestion: false },
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
        videoSource: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // const handleVideoInfoChange = (index, e) => {
  //   const newVideoInfo = [...videoInfo];
  //   newVideoInfo[index].name = e.target.value;
  //   setVideoInfo(newVideoInfo);
  // };

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
        <InputVideoQAFunction
          FormMode={true}
          VideoFile={formType.videoSource}
          VideoQA={videoInfo}
          setVideoQA={setVideoInfo}

          // ChangeVideoTimeEvent={(e) => {
          //   setCurrentTime(e.target.value);
          // }}
          // GetVideoTimeEvent={handleGetVideoTimeClick}
        />
      );
    case 3:
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
  }
}

export default CreateVideoForm;
