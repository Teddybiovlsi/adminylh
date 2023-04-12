import React, { useState } from "react";
import InputVideoFileFunction from "./shared/InputVideoFileFunction";
import InputVideoInfoFunction from "./shared/InputVideoInfoFunction";
import InputVideoQAFunction from "./shared/InputVideoQAFunction";
import InputFormPreviewFunction from "./shared/InputFormPreviewFunction";
import InputVideoTypeFunction from "./shared/InputVideoTypeFunction";
import StatusCode from "../../sys/StatusCode";
import { post } from "../axios";

export default function CreateVideo({ VideoMode = false }) {
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
    videoType: "",
    questionNum: 1,
  });

  // 若註冊成功，則顯示成功訊息
  const [successMessage, setSuccessMessage] = useState("");
  // 若註冊失敗，則顯示錯誤訊息
  const [errorMessage, setErrorMessage] = useState("");

  const [successBoolean, setSuccessBoolean] = useState(false);

  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  const sendVideoData = async (data) => {
    try {
      const response = await post("video", data);
      // if errorMessage is not empty, then set it to empty
      {
        errorMessage && setErrorMessage("");
      }
      setSuccessMessage("成功創建影片");
      setSuccessBoolean(true);
      console.log(response.data);
    } catch (error) {
      // setErrorMessage(StatusCode(error.response.status));
      console.log(error);
    }
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

  const prevStep = (e) => {
    setFormType({ ...formType, [e.target.name]: formType.formStep - 1 });
  };

  const nextStep = (e) => {
    setFormType({ ...formType, [e.target.name]: formType.formStep + 1 });
  };

  const submitAction = () => {
    const formData = new FormData();
    formData.append("videoFile", formType.videoFile);
    formData.append("videoName", formType.videoFileName);
    formData.append("videoLanguage", formType.videoLanguage);
    formData.append("videoType", formType.videoType);
    videoInfo.forEach((element) => {
      console.log(element);
      // store the videoInfo in formData  as a array
      formData.append("info[]", JSON.stringify(element));
    });
    sendVideoData(formData);
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
        <InputVideoTypeFunction
          FormMode={VideoMode}
          ChangeEvent={(e) => {
            setFormType({
              ...formType,
              videoType: e.target.value,
            });
          }}
          VideoType={formType.videoType ? formType.videoType : null}
          GoPrevEvent={prevStep}
          GoNextEvent={nextStep}
        />
      );
    case 4:
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
    case 5:
      return (
        <InputFormPreviewFunction
          FormMode={VideoMode}
          VideoName={formType.videoFileName}
          VideoLanguage={formType.videoLanguage}
          VideoType={formType.videoType}
          VideoQA={videoInfo}
          GoPrevEvent={prevStep}
          SubmitEvent={submitAction}
        />
      );
    default:
      return;
  }
}
