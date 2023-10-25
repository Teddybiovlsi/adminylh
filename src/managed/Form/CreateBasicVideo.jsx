import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Modal, ModalFooter, Stack } from "react-bootstrap";
import { post } from "../axios";
import { toast } from "react-toastify";
import useModal from "../../hooks/useModal";
import InputVideoFileFunction from "./shared/InputVideoFileFunction";
import InputVideoTitleFunction from "./shared/InputVideoTitleFunction";
import InputVideoLanguageFunction from "./shared/InputVideoLanguageFunction";
import InputVideoTypeFunction from "./shared/InputVideoTypeFunction";
import BtnBootstrap from "../../components/BtnBootstrap";
import ToastAlert from "../../components/ToastAlert";
import PageTitle from "../../components/Title";
import PageTitleHeading from "../../components/PageTitleHeading";
import { Step, Stepper } from "react-form-stepper";
import InputVideoBasicQAFunction from "./shared/InputVideoBasicQAFunction";
import InputFormBasicPreviewFunction from "./shared/InputFormBasicPreviewFunction";

// 基礎測驗的表單
export default function CreateBasicVideo() {
  const navigate = useNavigate();

  const [videoInfo, setVideoInfo] = useState([
    {
      questionContent: "",
      numofOptions: 0,
      answerContent: [],
    },
  ]);

  const [formType, setFormType] = useState({
    activeStep: 0,
    checkFormQuestion: false,
    completedSteps: [false, false, false, false, false, false],
    formStep: 0,
    isSkipped: false,
    questionNum: 1,
    videoDuration: 0,
    videoFile: "",
    videoFileName: "",
    videoLanguage: "",
    videoSource: "",
    videoTitleName: "",
    videoType: "",
  });

  const [disabledSubmit, setDisabledSubmit] = useState(false);

  const [
    confirmSkipQuestion,
    handleCloseConfirmSkipQuestion,
    handleConfirmSkipQuestion,
  ] = useModal();

  const sendVideoData = async (data) => {
    const videoFormID = toast.loading("上傳中...");
    setDisabledSubmit(true);
    try {
      const response = await post("video/basicQuiz", data);
      console.log(response);
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
      const file = e.target.files[0];
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = function () {
        const duration = video.duration;
        setFormType({
          ...formType,
          videoFile: e.target.files[0],
          videoFileName: e.target.files[0].name,
          // remove the suffix of the video file name
          videoTitleName: e.target.files[0].name.split(".")[0],
          videoSource: URL.createObjectURL(e.target.files[0]),
          videoDuration: duration,
        });
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const prevStep = (e) => {
    if (formType.formStep === 5) {
      setFormType((prevState) => ({
        ...prevState,
        completedSteps: prevState.completedSteps.map((step, index) =>
          index === prevState.formStep ? false : step
        ),
        isSkipped: true,
        checkFormQuestion: false,
        formStep: prevState.formStep - 1,
      }));
    } else {
      setFormType({ ...formType, [e.target.name]: formType.formStep - 1 });
    }
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
      if (formType.formStep === 3) {
        // console.log(formType.formStep);
        setFormType((prevState) => ({
          ...prevState,
          completedSteps: prevState.completedSteps.map((step, index) =>
            index === prevState.formStep ? true : step
          ),
        }));
        handleConfirmSkipQuestion();
        return;
      }

      if (formType.formStep === 4) {
        setFormType((prevState) => ({
          ...prevState,
          isSkipped: false,
          checkFormQuestion: true,
          completedSteps: prevState.completedSteps.map((step, index) =>
            index === prevState.formStep ? true : step
          ),
          formStep: prevState.formStep + 1,
        }));
        return;
      }

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
    const {
      videoFile,
      videoTitleName,
      videoFileName,
      videoLanguage,
      videoType,
      videoDuration,
      isSkipped,
    } = formType;
    const formData = new FormData();
    formData.append("videoFile", videoFile);
    formData.append("videoTitleName", videoTitleName);
    formData.append("videoName", videoFileName);
    formData.append("videoLanguage", videoLanguage);
    formData.append("videoType", videoType);
    formData.append("videoDuration", videoDuration);
    formData.append("videoIsBasic", true);
    formData.append("isSkip", isSkipped);
    if (!isSkipped) {
      videoInfo.forEach((element) => {
        formData.append("info[]", JSON.stringify(element));
      });
    }
    sendVideoData(formData);
  };

  const FormStep = (step) => {
    switch (step) {
      case 0:
        return (
          <InputVideoFileFunction
            ChangeEvent={hadleVideoFileIsUpload}
            isBasicVideo={true}
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
            d={prevStep}
            GoNextEvent={nextStep}
          />
        );
      case 2:
        return (
          <InputVideoLanguageFunction
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
          <InputVideoBasicQAFunction
            formType={formType}
            VideoQA={videoInfo}
            setVideoQA={setVideoInfo}
            GoPrevEvent={prevStep}
            GoNextEvent={nextStep}
          />
        );
      case 5:
        return (
          <InputFormBasicPreviewFunction
            isSkip={formType.isSkipped}
            isCheckValidationQA={formType.checkFormQuestion}
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
      <PageTitle title={`台大醫院雲林分院｜基礎練習用表單`} />
      <PageTitleHeading text={`基礎練習用表單系統`} styleOptions={9} />
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
        <Step label="表單預覽" disabled={true} />
      </Stepper>

      {FormStep(formType.formStep)}
      <Modal show={confirmSkipQuestion} onHide={handleCloseConfirmSkipQuestion}>
        <Modal.Header closeButton>
          <Modal.Title>請確認</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          請確認是否要跳過 <b className="text-danger">填寫問題步驟</b>
          ，直接進入表單預覽畫面
        </Modal.Body>
        <ModalFooter>
          <Stack gap={2}>
            <BtnBootstrap
              variant="outline-primary"
              btnSize="md"
              text={"確認"}
              onClickEventName={() => {
                setFormType({
                  ...formType,
                  isSkipped: true,
                  completedSteps: formType.completedSteps.map((step, index) =>
                    index === 4 ? true : step
                  ),
                  formStep: 5,
                });
                handleCloseConfirmSkipQuestion();
              }}
            />
            <BtnBootstrap
              variant="outline-secondary"
              text={"取消"}
              btnSize="md"
              onClickEventName={() => {
                setFormType({
                  ...formType,
                  completedSteps: formType.completedSteps.map((step, index) =>
                    index === 4 ? false : step
                  ),
                  formStep: formType.formStep + 1,
                });
                handleCloseConfirmSkipQuestion();
              }}
            />
          </Stack>
        </ModalFooter>
      </Modal>

      <ToastAlert />
    </Container>
  );
}