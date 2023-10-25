import React, { useState, useRef, useEffect } from "react";
import { Card, Col, Container, Row, Stack } from "react-bootstrap";
import PageTitle from "../../components/Title";
import { CardTitleFunction } from "./shared/CardTitleFunction";
import { update } from "lodash/fp";
import BtnBootstrap from "../../components/BtnBootstrap";
import DynamicQuestionandAnswer from "./shared/DynamicQuestionandAnswer";
import styles from "../../styles/Form/FormStyles.module.scss";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";
import { get, put } from "../axios";
import ToastAlert from "../../components/ToastAlert";
import { toast } from "react-toastify";
import { Step, Stepper } from "react-form-stepper";
import PageTitleHeading from "../../components/PageTitleHeading";
import BasicDynamicQuestionAndAnswer from "./shared/BasicDynamicQuestionAndAnswer";

export default function EditClientBasicVideoQA() {
  const location = useLocation();

  const navigate = useNavigate();

  if (!location || location?.state === null) {
    navigate("/", { replace: true });
  }

  const { haveQuestion } = location?.state;

  const [formType, setFormType] = useState({
    activeStep: 0,
    completedSteps: new Set(),
    formStep: 0,
    ifVaildateBtnDisable: false,
    nextBtnDisable: true,
  });

  const [videoInfo, setVideoInfo] = useState([
    {
      questionContent: "",
      numofOptions: 0,
      answerContent: [],
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchVideoDataAsync = async () => {
      // await fetchVideoData({ api: `videoQA/${location?.state?.videoID}` });
    };

    if (!ignore && haveQuestion) {
      fetchVideoDataAsync();
    }

    if (haveQuestion === false) {
      setIsLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, []);

  // 增加/刪減 影片問題輸入框...
  // 增加輸入欄位
  const handleAddQuestion = () => {
    setFormType({ ...formType, ifVaildateBtnDisable: true });
    setVideoInfo([
      ...videoInfo,
      {
        questionContent: "",
        numofOptions: 0,
        answerContent: [],
      },
    ]);
  };

  // 刪減輸入欄位
  const handleDelQAMessage = (index) => {
    setVideoInfo((prevVideoQA) => prevVideoQA.filter((_, i) => i !== index));
  };

  //取得問題填寫內容變動
  const handleGetQuestionContent = (index, e) => {
    setFormType({ ...formType, ifVaildateBtnDisable: true });
    setVideoInfo(
      update(`${index}.questionContent`, () => e.target.value, VideoQA)
    );
  };

  // 取得答題選項數目變動
  const handleOptionChange = (index, e) => {
    setFormType({ ...formType, ifVaildateBtnDisable: true });
    const numOfChoice = parseInt(e.target.value);
    setVideoInfo(
      update(
        index,
        (question) => ({
          ...question,
          answerContent: Array.from({ length: numOfChoice }, () => [false, ""]),
          numofOptions: numOfChoice,
        }),
        VideoQA
      )
    );
  };

  //   取得答題正確答案變動
  const handleIsCorrectOption = (questionindex, answerOptionIndex) => {
    const newVideoQA = [...VideoQA];
    const currentOption = newVideoQA[questionindex].answerContent;

    setFormType({ ...formType, ifVaildateBtnDisable: true });
    const updateAnswerOption = currentOption.map((answer, index) => {
      if (index === answerOptionIndex) {
        // console.log([!answer[0], answer[1]]);
        return [!answer[0], answer[1]];
      }
      return [false, answer[1]];
    });
    newVideoQA[questionindex].answerContent = updateAnswerOption;
    setVideoInfo(newVideoQA);
  };

  const handleAnswerChange = (index, answerContentIndex, e) => {
    setFormType({ ...formType, ifVaildateBtnDisable: true });
    setIfBtnDisable(true);
    const newVideoQA = [...VideoQA];
    newVideoQA[index].answerContent[answerContentIndex][1] = e.target.value;
    setVideoInfo(newVideoQA);
  };

  // 驗證問題/選項/答案是否為空
  const validateQA = () => {
    let ifAnyAnswerContentIsEmpty = false;
    setIfVaildateBtnDisable(true);

    const questionIsEmpty = videoInfo.some((info) => !info.questionContent);
    const ifAnyArrayOptionIndicesIsEmpty = videoInfo.reduce(
      (acc, curr, index) => {
        if (curr.answerContent.length === 0) {
          acc.push(index);
        } else if (curr.answerContent.some((value) => value[1] === "")) {
          ifAnyAnswerContentIsEmpty = true;
        }
        return acc;
      },
      []
    );
  };

  const FormStep = (step) => {
    switch (step) {
      case 0:
        return (
          <Container>
            <Row>
              <Col>
                <Stack gap={2}>
                  <div>
                    <h2>
                      <strong>請填寫衛教基礎練習影片問題</strong>
                    </h2>
                  </div>

                  <BtnBootstrap
                    btnPosition="mb-1"
                    btnSize="md"
                    text={"新增問題"}
                    onClickEventName={handleAddQuestion}
                    variant="outline-secondary"
                  />
                </Stack>

                <BasicDynamicQuestionAndAnswer
                  VideoQA={videoInfo}
                  handleDelQAMessage={handleDelQAMessage}
                  handleGetQuestionContent={handleGetQuestionContent}
                  handleOptionChange={handleOptionChange}
                  handleIsCorrectOption={handleIsCorrectOption}
                  handleAnswerChange={handleAnswerChange}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <BtnBootstrap
                  btnPosition=""
                  btnSize="lg"
                  btnName={"formStep"}
                  text={"驗證此頁面表單"}
                  onClickEventName={validateQA}
                  disabled={formType.ifVaildateBtnDisable}
                  variant="outline-success"
                />
                <BtnBootstrap
                  btnPosition="ms-2  float-end"
                  btnSize="lg"
                  btnName="formStep"
                  variant="outline-primary"
                  text={"預覽表單"}
                  //   onClickEventName={GoNextEvent}
                  //   disabled={ifBtnDisable}
                />
              </Col>
            </Row>
          </Container>
        );
      //   case 1:
      //     return (
      //       <Container>
      //         <Row>
      //           <Col className="h5 ps-0" md={4}>
      //             影片名稱:
      //           </Col>
      //           <Col md={6}>{VideoTitle != "" ? VideoTitle : VideoName}</Col>
      //         </Row>

      //         <Row>
      //           <Col className="h5 ps-0" md={4}>
      //             影片語言:
      //           </Col>
      //           <Col md={6}>{SwitchNumToLanguage(parseInt(VideoLanguage))}</Col>
      //         </Row>

      //         <Row>
      //           <Col className="h5 ps-0" md={4}>
      //             影片類型:
      //           </Col>
      //           <Col md={6}>{SwitchNumToType(parseInt(VideoType))}</Col>
      //         </Row>
      //         {isCheckValidationQA &&
      //           videoInfo?.map((q, i) => (
      //             <Card key={i} className="mb-2">
      //               <Card.Title className="mb-2 ms-1">問題 {i + 1}:</Card.Title>
      //               <Container>
      //                 <Row>
      //                   <Col className="h5 ps-0 ms-2" md={4}>
      //                     問題內容:
      //                   </Col>
      //                   <Col md={6}>{q.questionContent}</Col>
      //                 </Row>
      //               </Container>
      //               {q.answerContent.map((a, j) => (
      //                 <div key={`${i}-${j}`}>
      //                   <Card.Title className="ms-2">{`答案${String.fromCharCode(
      //                     65 + j
      //                   )}:`}</Card.Title>
      //                   <Card.Text
      //                     className={`ms-4 ${
      //                       a[0] ? "text-success" : "text-danger"
      //                     }`}
      //                   >{`${a[1]}-答案為${a[0] ? "正確" : "錯誤"}`}</Card.Text>
      //                 </div>
      //               ))}
      //             </Card>
      //           ))}

      //         <Stack gap={2} className="col-md-5 mx-auto">
      //           <BtnBootstrap
      //             btnPosition=""
      //             btnName="formStep"
      //             btnSize="md"
      //             disabled={SubmitEventDisabled}
      //             text={"送出表單"}
      //             onClickEventName={SubmitEvent}
      //             variant="outline-primary"
      //           />
      //           <BtnBootstrap
      //             btnPosition=""
      //             btnName={"formStep"}
      //             btnSize="md"
      //             text={"上一步"}
      //             onClickEventName={GoPrevEvent}
      //             variant={"outline-danger"}
      //           />
      //         </Stack>
      //       </Container>
      //     );
      default:
        return;
    }
  };

  //   if (!isLoading) {
  //     return <LoadingComponent title="台大分院雲林分院 編輯表單系統" />;
  //   }

  return (
    <Container>
      <PageTitle title={`台大醫院雲林分院｜基礎練習用表單`} />
      <PageTitleHeading text={`基礎練習用表單系統`} styleOptions={9} />
      <Stepper
        // activeStep={formType.activeStep}
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
          label="填寫影片問題"
          //   onClick={() => {
          //     setFormType({ ...formType, formStep: 4 });
          //   }}
          //   completed={formType.completedSteps[4]}
        />
        <Step label="表單預覽" disabled={true} />
      </Stepper>
      {FormStep(formType.formStep)}
      <ToastAlert />
    </Container>
  );
}
