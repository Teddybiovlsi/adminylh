import React, { useState } from "react";
import InputVideoFileFunction from "./shared/InputVideoFileFunction";
import InputVideoTitleFunction from "./shared/InputVideoTitleFunction";
import InputVideoLanguageFunction from "./shared/InputVideoLanguageFunction";
import InputVideoQAFunction from "./shared/InputVideoQAFunction";
import InputFormPreviewFunction from "./shared/InputFormPreviewFunction";
import InputVideoTypeFunction from "./shared/InputVideoTypeFunction";
import StatusCode from "../../sys/StatusCode";
import { post } from "../axios";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import ToastAlert from "../../components/ToastAlert";
import { toast } from "react-toastify";
import PageTitle from "../../components/Title";
import PageTitleHeading from "../../components/PageTitleHeading";
import { Step, Stepper } from "react-form-stepper";

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
    formStep: 0,
    activeStep: 0,
    completedSteps: [false, false, false, false, false, false],
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
    if (formType.activeStep > formType.formStep) {
      setFormType((prevState) => ({
        ...prevState,
        completedSteps: prevState.completedSteps.map((step, index) =>
          index === prevState.formStep ? true : step
        ),
        formStep: prevState.formStep + 1,
      }));
    } else {
      setFormType((prevState) => ({
        ...prevState,
        activeStep: prevState.activeStep + 1,
        completedSteps: prevState.completedSteps.map((step, index) =>
          index === prevState.formStep ? true : step
        ),
        formStep: prevState.formStep + 1,
      }));
    }
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
    switch (step) {
      case 0:
        return (
          <InputVideoFileFunction
            FormMode={VideoMode}
            ChangeEvent={hadleVideoFileIsUpload}
            VidoeName={formType.videoFileName}
            GoNextEvent={nextStep}
          />
        );
      case 1:
        return (
          <InputVideoTitleFunction
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
      case 2:
        return (
          <InputVideoLanguageFunction
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
      case 5:
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
      <PageTitle
        title={`台大醫院雲林分院｜ ${VideoMode ? "測驗用表單" : "練習用表單"}`}
      />
      <PageTitleHeading
        text={`${VideoMode ? "測驗用表單" : "練習用表單"}系統`}
        styleOptions={9}
      />
      <Stepper
        activeStep={formType.activeStep}
        connectorStateColors
        connectorStyleConfig={{
          activeColor: "#6A70AB",
        }}
        styleConfig={{
          activeBgColor: "#2D3479",
          activeTextColor: "#fff",
          completedBgColor: "#A3427F",
          completedTextColor: "#fff",
        }}
      >
        <Step
          label="匯入影片"
          onClick={() => {
            setFormType({ ...formType, formStep: 0 });
          }}
          completed={formType.completedSteps[0]}
        />
        <Step
          label="填寫影片標題"
          onClick={() => {
            setFormType({ ...formType, formStep: 1 });
          }}
          completed={formType.completedSteps[1]}
        />
        <Step
          label="選擇影片語言"
          onClick={() => {
            setFormType({ ...formType, formStep: 2 });
          }}
          completed={formType.completedSteps[2]}
        />
        <Step
          label="選擇影片類別"
          onClick={() => {
            setFormType({ ...formType, formStep: 3 });
          }}
          completed={formType.completedSteps[3]}
        />
        <Step
          label="填寫影片問題"
          onClick={() => {
            setFormType({ ...formType, formStep: 4 });
          }}
          completed={formType.completedSteps[4]}
        />
        <Step
          label="表單預覽"
          onClick={() => {
            setFormType({ ...formType, formStep: 5 });
          }}
          completed={formType.completedSteps[5]}
        />
      </Stepper>

      {FormStep(formType.formStep)}
      <ToastAlert />
    </Container>
  );
}
