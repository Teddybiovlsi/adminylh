import InputFormPreviewFunction from './shared/InputFormPreviewFunction';
import InputVideoFileFunction from './shared/InputVideoFileFunction';
import InputVideoLanguageFunction from './shared/InputVideoLanguageFunction';
import InputVideoQAFunction from './shared/InputVideoQAFunction';
import InputVideoTitleFunction from './shared/InputVideoTitleFunction';
import InputVideoTypeFunction from './shared/InputVideoTypeFunction';
import PageTitle from '../../components/Title';
import PageTitleHeading from '../../components/PageTitleHeading';
import React, { useEffect, useState } from 'react';
import { Step, Stepper } from 'react-form-stepper';
import { post } from '../axios';
import { toast } from 'react-toastify';
import useModal from '../../hooks/useModal';
import { useNavigate } from 'react-router-dom';
import { Container, Modal, ModalFooter, Stack } from 'react-bootstrap';
import ToastAlert from '../../components/ToastAlert';
import 'react-toastify/dist/ReactToastify.css';
import InputVideoScreenShot from './shared/InputVideoScreenShot';
import BtnBootstrap from '../../components/BtnBootstrap';

export default function CreateVideo({ VideoMode = false }) {
  const navigate = useNavigate();

  const [videoInfo, setVideoInfo] = useState([
    {
      currentTime: 0,
      durationTime: 0,
      messageType: 0,
      mustCorrectQuestion: false,
      questionContent: '',
      numofOptions: 0,
      answerContent: [],
    },
  ]);

  const [formType, setFormType] = useState({
    VideoMode: VideoMode ? 1 : 0,
    activeStep: 0,
    checkFormQuestion: false,
    completedSteps: [false, false, false, false, false, false],
    formStep: 0,
    isSkipped: false,
    questionNum: 1,
    videoDuration: 0,
    videoFile: '',
    videoFileName: '',
    videoLanguage: '',
    videoSource: '',
    videoTitleName: '',
    videoType: '',
    imageFile: '',
    imageFileName: '',
    imageSource: '',
  });

  const [loadingBtn, setLoadingBtn] = useState(false);

  // Modal
  const [
    confirmSkipQuestion,
    handleCloseConfirmSkipQuestion,
    handleConfirmSkipQuestion,
  ] = useModal();

  const sendVideoData = async (data) => {
    try {
      await post('video', data);
      toast.success('上傳成功', {
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      setTimeout(() => {
        setLoadingBtn(false);
        navigate('/', { replace: true });
      }, 3000);
    } catch (error) {
      console.log(error.response.data);

      if (error.code === 'ECONNABORTED') {
        toast.error('上傳失敗，請稍後再試', {
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        setTimeout(() => {
          setLoadingBtn(false);
        }, 4000);
      } else {
        console.log(error.response.data);
        toast.error('上傳失敗，請稍後再試', {
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        setTimeout(() => {
          setLoadingBtn(false);
        }, 4000);
      }
    }
  };

  const hadleVideoFileIsUpload = (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function () {
        const duration = video.duration;
        setFormType({
          ...formType,
          videoFile: e.target.files[0],
          videoFileName: e.target.files[0].name,
          // remove the suffix of the video file name
          videoTitleName: e.target.files[0].name.split('.')[0],
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
        if (!base64.startsWith('data:image/png;base64,')) {
          // If not, replace the existing prefix with "data:image/png;base64,"
          base64 = 'data:image/png;base64,' + base64.split(',')[1];
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
      imageFile: '',
      imageFileName: '',
      imageSource: '',
    });
  };

  const prevStep = (e) => {
    setFormType((prevState) => ({
      ...prevState,
      formStep: prevState.formStep - 1,
    }));
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
      if (formType.formStep === 4) {
        console.log(formType.formStep);
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

  const submitAction = () => {
    const formData = new FormData();
    formData.append('videoMode', VideoMode);
    formData.append('videoFile', formType.videoFile);
    formData.append('videoTitleName', formType.videoTitleName);
    formData.append('videoName', formType.videoFileName);
    formData.append('videoLanguage', formType.videoLanguage);
    formData.append('videoType', formType.videoType);
    formData.append('videoDuration', formType.videoDuration);
    formData.append('imageSrc', formType.imageSource);
    formData.append('isSkip', formType.isSkipped);
    videoInfo.forEach((element) => {
      // console.log(element);
      // store the videoInfo in formData  as a array
      formData.append('info[]', JSON.stringify(element));
    });
    setLoadingBtn(true);
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
            VideoSource={formType.videoSource}
            GoNextEvent={nextStep}
          />
        );
      case 1:
        return (
          <InputVideoScreenShot
            FormMode={VideoMode}
            VideoSrc={formType.videoSource}
            ThumbnailSrc={formType.imageSource}
            ThumbnailChangeEvent={handleThumbnail}
            ChangeEvent={handleImageFileIsUpload}
            ResetEvent={handleImageFileIsRemove}
            GoNextEvent={nextStep}
            GoPrevEvent={prevStep}
          />
        );
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
            GoPrevEvent={prevStep}
            GoNextEvent={nextStep}
          />
        );
      case 3:
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
            VideoFile={formType.videoSource}
            formType={formType}
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
            isSkip={formType.isSkipped}
            isCheckValidationQA={formType.checkFormQuestion}
            VideoName={formType.videoFileName}
            VideoTitle={formType.videoTitleName}
            VideoLanguage={formType.videoLanguage}
            VideoType={formType.videoType}
            VideoQA={videoInfo}
            GoPrevEvent={prevStep}
            SubmitEvent={submitAction}
            SubmitEventDisabled={loadingBtn}
          />
        );
      default:
        return;
    }
  };

  return (
    <>
      <Container>
        <PageTitle
          title={`台大醫院雲林分院｜ ${
            VideoMode ? '測驗用表單' : '練習用表單'
          }`}
        />
        <PageTitleHeading
          text={`${VideoMode ? '測驗用表單' : '練習用表單'}系統`}
          styleOptions={9}
        />
        <Stepper
          activeStep={formType.activeStep}
          connectorStateColors
          connectorStyleConfig={{
            activeColor: '#6A70AB',
          }}
          styleConfig={{
            activeBgColor: '#2D3479',
            activeTextColor: '#fff',
            completedBgColor: '#A3427F',
            completedTextColor: '#fff',
          }}
        >
          <Step
            label='匯入影片'
            onClick={() => {
              setFormType({ ...formType, formStep: 0 });
            }}
            completed={formType.completedSteps[0]}
          />
          <Step
            label='選擇縮圖'
            onClick={() => {
              setFormType({ ...formType, formStep: 1 });
            }}
            completed={formType.completedSteps[1]}
          />
          <Step
            label='填寫影片標題'
            onClick={() => {
              setFormType({ ...formType, formStep: 2 });
            }}
            completed={formType.completedSteps[2]}
          />
          <Step
            label='選擇影片語言'
            onClick={() => {
              setFormType({ ...formType, formStep: 3 });
            }}
            completed={formType.completedSteps[3]}
          />
          <Step
            label='選擇影片類別'
            onClick={() => {
              setFormType({ ...formType, formStep: 4 });
            }}
            completed={formType.completedSteps[4]}
          />
          <Step
            label='填寫影片問題'
            onClick={() => {
              setFormType({ ...formType, formStep: 5 });
            }}
            completed={formType.completedSteps[5]}
          />
          <Step label='表單預覽' disabled={true} />
        </Stepper>

        {FormStep(formType.formStep)}
        <Modal
          show={confirmSkipQuestion}
          onHide={handleCloseConfirmSkipQuestion}
        >
          <Modal.Header closeButton>
            <Modal.Title>請確認</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            請確認是否要跳過 <b className='text-danger'>填寫問題步驟</b>
            ，直接進入表單預覽畫面
          </Modal.Body>
          <ModalFooter>
            <Stack gap={2}>
              <BtnBootstrap
                variant='outline-primary'
                btnSize='md'
                text={'確認'}
                onClickEventName={() => {
                  setFormType({
                    ...formType,
                    isSkipped: true,
                    completedSteps: formType.completedSteps.map((step, index) =>
                      index === 5 ? true : step
                    ),
                    formStep: 6,
                  });
                  handleCloseConfirmSkipQuestion();
                }}
              />
              <BtnBootstrap
                variant='outline-secondary'
                text={'取消'}
                btnSize='md'
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
      </Container>
      <ToastAlert />
    </>
  );
}
