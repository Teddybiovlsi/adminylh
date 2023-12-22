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
import ToastAlert from "../../components/ToastAlert";
import PageTitle from "../../components/Title";
import PageTitleHeading from "../../components/PageTitleHeading";
import { Step, Stepper } from "react-form-stepper";
import InputVideoBasicQAFunction from "./shared/InputVideoBasicQAFunction";
import InputFormBasicPreviewFunction from "./shared/InputFormBasicPreviewFunction";
import BtnBootstrap from "../../components/BtnBootstrap";
import InputVideoScreenShot from "./shared/InputVideoScreenShot";

// 基礎測驗的表單
export default function CreateBasicVideo() {
  const navigate = useNavigate();

  const [videoInfo, setVideoInfo] = useState([
    {
      questionContent: "",
      questionPoint: 100,
      numofOptions: 0,
      answerFile: [],
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
    imageFile: "",
    imageFileName: "",
    imageSource: "",
  });

  const [disabledSubmit, setDisabledSubmit] = useState(false);

  const [
    confirmSkipQuestion,
    handleCloseConfirmSkipQuestion,
    handleConfirmSkipQuestion,
  ] = useModal();

  // 傳送影片資料到後端
  const sendVideoData = async (data) => {
    setDisabledSubmit(true);
    try {
      const response = await post("video/basicQuiz", data);
      toast.success("成功創建影片，3秒後將回到首頁", {
        autoClose: 3000,
      });
      setTimeout(() => {
        setDisabledSubmit(false);
        navigate("/", { replace: true });
      }, 3000);
    } catch (error) {
      console.log(error.response);
      if (error.code === "ECONNABORTED") {
        toast.error("上傳失敗，請稍後再試", {
          autoClose: 3000,
        });
        setDisabledSubmit(false);
      } else {
        toast.error("上傳失敗，請稍後再試", {
          autoClose: 3000,
        });
        setDisabledSubmit(false);
      }
    }
  };

  // 處理影片資料上傳
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

  // 上傳圖片事件
  const handleImageFileIsUpload = (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        let base64 = reader.result;
        // Check if the base64 string contains the "data:image/png;base64," prefix
        if (!base64.startsWith("data:image/png;base64,")) {
          // If not, replace the existing prefix with "data:image/png;base64,"
          base64 = "data:image/png;base64," + base64.split(",")[1];
        }
        setFormType({
          ...formType,
          imageFile: file,
          imageFileName: file.name,
          imageSource: base64,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  // 儲存縮圖事件
  const handleThumbnail = (thumbnail) => {
    setFormType({
      ...formType,
      imageFileName: `${formType.videoFileName}縮圖`,
      imageSource: thumbnail,
    });
  };

  const handleImageFileIsRemove = () => {
    setFormType({
      ...formType,
      imageFile: "",
      imageFileName: "",
      imageSource: "",
    });
  };

  // 上一步
  const prevStep = (e) => {
    setFormType((prevState) => ({
      ...prevState,
      formStep: prevState.formStep - 1,
    }));
  };

  // 下一步
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
      if (formType.formStep === 4) {
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

      if (formType.formStep === 5) {
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

  // 送出表單事件
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
    formData.append("imageSrc", formType.imageSource);
    formData.append("videoIsBasic", true);
    formData.append("isSkip", isSkipped);
    if (!isSkipped) {
      videoInfo.forEach((element) => {
        console.log(element);
        formData.append("info[]", JSON.stringify(element));

        element.answerFile.forEach((file) => {
          // 如果有圖片檔案，就加入到 formData
          formData.append("answerFile[]", file);

          if (file !== null) formData.append("answerHavePic[]", "true");
          else formData.append("answerHavePic[]", "false");
        });
      });
    }

    // console.log(formData.getAll("info[]"));
    sendVideoData(formData);
  };

  // 表單步驟
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
        <InputVideoScreenShot
          isBasic={true}
          VideoSrc={formType.videoSource}
          ThumbnailSrc={formType.imageSource}
          ThumbnailChangeEvent={handleThumbnail}
          ChangeEvent={handleImageFileIsUpload}
          ResetEvent={handleImageFileIsRemove}
          GoNextEvent={nextStep}
          GoPrevEvent={prevStep}
        />;
      case 2:
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
      case 3:
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
      case 4:
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
      case 5:
        return (
          <InputVideoBasicQAFunction
            formType={formType}
            VideoQA={videoInfo}
            setVideoQA={setVideoInfo}
            GoPrevEvent={prevStep}
            GoNextEvent={nextStep}
          />
        );
      case 6:
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

  // 建立基礎練習用表單元件
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
          label="選擇縮圖"
          onClick={() => {
            setFormType({ ...formType, formStep: 1 });
          }}
          completed={formType.completedSteps[1]}
        />
        <Step
          label="填寫影片標題"
          onClick={() => {
            setFormType({ ...formType, formStep: 2 });
          }}
          completed={formType.completedSteps[2]}
        />
        <Step
          label="選擇影片語言"
          onClick={() => {
            setFormType({ ...formType, formStep: 3 });
          }}
          completed={formType.completedSteps[3]}
        />
        <Step
          label="選擇影片類別"
          onClick={() => {
            setFormType({ ...formType, formStep: 4 });
          }}
          completed={formType.completedSteps[4]}
        />
        <Step
          label="填寫影片問題"
          onClick={() => {
            setFormType({ ...formType, formStep: 5 });
          }}
          completed={formType.completedSteps[5]}
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
