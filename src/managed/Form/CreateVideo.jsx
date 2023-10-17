import React, { useState } from "react";
import InputVideoFileFunction from "./shared/InputVideoFileFunction";
import InputVideoTitleFunction from "./shared/InputVideoTitleFunction";
import InputVideoInfoFunction from "./shared/InputVideoInfoFunction";
import InputVideoQAFunction from "./shared/InputVideoQAFunction";
import InputFormPreviewFunction from "./shared/InputFormPreviewFunction";
import InputVideoTypeFunction from "./shared/InputVideoTypeFunction";
import StatusCode from "../../sys/StatusCode";
import { post } from "../axios";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import ToastAlert from "../../components/ToastAlert";
import { toast } from "react-toastify";

export default function CreateVideo({ VideoMode = false }) {
  const navigate = useNavigate();

  const [videoInfo, setVideoInfo] = useState([
    {
      currentTime: 0,
      durationTime: 0,
      messageType: 0,
      mustCorrectQuestion: false,
      questionContent: "",
      numofOptions: 0,
      answerContent: [],
    },
  ]);

  const [formType, setFormType] = useState({
    VideoMode: VideoMode ? 1 : 0,
    formStep: 5,
    videoFile: "",
    videoSource: "",
    videoFileName: "",
    videoTitleName: "",
    videoLanguage: "",
    videoType: "",
    videoDuration: 0,
    questionNum: 1,
  });

  const [disabledSubmit, setDisabledSubmit] = useState(false);

  const sendVideoData = async (data) => {
    const videoFormID = toast.loading("上傳中...");
    setDisabledSubmit(true);
    try {
      const response = await post("video", data);
      toast.update(videoFormID, {
        render: "成功創建影片，3秒後將回到首頁",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setTimeout(() => {
        setDisabledSubmit(false);
        navigate("/", { replace: true });
      }, 3000);
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        toast.update(videoFormID, {
          render: "上傳失敗，請稍後再試",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setDisabledSubmit(false);
      } else {
        console.log(error.response.data);
        toast.update(videoFormID, {
          render: "上傳失敗，請稍後再試",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setDisabledSubmit(false);
      }
    }
  };

  const hadleVideoFileIsUpload = (e) => {
    if (e.target.files.length !== 0) {
      setFormType({
        ...formType,
        videoFile: e.target.files[0],
        videoFileName: e.target.files[0].name,
        // remove the suffix of the video file name
        videoTitleName: e.target.files[0].name.split(".")[0],
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
    formData.append("videoMode", VideoMode);
    formData.append("videoFile", formType.videoFile);
    formData.append("videoTitleName", formType.videoTitleName);
    formData.append("videoName", formType.videoFileName);
    formData.append("videoLanguage", formType.videoLanguage);
    formData.append("videoType", formType.videoType);
    formData.append("videoDuration", formType.videoDuration);
    videoInfo.forEach((element) => {
      // console.log(element);
      // store the videoInfo in formData  as a array
      formData.append("info[]", JSON.stringify(element));
    });
    sendVideoData(formData);
  };
  const FormStep = (step) => {
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
          <InputVideoTitleFunction
            FormMode={VideoMode}
            ChangeEvent={(e) => {
              setFormType({
                ...formType,
                videoTitleName: e.target.value,
              });
            }}
            VideoTitle={
              formType.videoTitleName ? formType.videoTitleName : null
            }
            GoPrevEvent={prevStep}
            GoNextEvent={nextStep}
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
            VideoLanguage={
              formType.videoLanguage ? formType.videoLanguage : null
            }
            GoPrevEvent={prevStep}
            GoNextEvent={nextStep}
          />
        );
      case 4:
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
      case 5:
        return (
          <InputVideoQAFunction
            FormMode={VideoMode}
            FormStep={formType.formStep}
            VideoFile={formType.videoSource}
            formType={formType}
            setDuration={
              formType.videoDuration === 0
                ? (duration) => {
                    setFormType({
                      ...formType,
                      videoDuration: duration,
                    });
                  }
                : null
            }
            VideoQA={videoInfo}
            setVideoQA={setVideoInfo}
            GoPrevEvent={prevStep}
            GoNextEvent={nextStep}
          />
        );
      case 6:
        return (
          <InputFormPreviewFunction
            FormMode={VideoMode}
            VideoName={formType.videoFileName}
            VideoTitle={formType.videoTitleName}
            VideoLanguage={formType.videoLanguage}
            VideoType={formType.videoType}
            VideoQA={videoInfo}
            GoPrevEvent={prevStep}
            SubmitEvent={submitAction}
            SubmitEventDisabled={disabledSubmit}
          />
        );
      default:
        return;
    }
  };

  return (
    <Container>
      {FormStep(formType.formStep)}
      <ToastAlert />
    </Container>
  );
}
