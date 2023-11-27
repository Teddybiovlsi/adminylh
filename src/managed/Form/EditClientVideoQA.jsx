import React, { useState, useRef, useEffect } from "react";
import { Card, Col, Container, Row, Stack } from "react-bootstrap";
import PageTitle from "../../components/Title";
import { CardTitleFunction } from "./shared/CardTitleFunction";
import { update } from "lodash/fp";
import DynamicQuestionandAnswer from "./shared/DynamicQuestionAndAnswer";
import BtnBootstrap from "../../components/BtnBootStrap";
import styles from "../../styles/Form/FormStyles.module.scss";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";
import { get, put } from "../axios";
import ToastAlert from "../../components/ToastAlert";
import { toast } from "react-toastify";
import PageTitleHeading from "../../components/PageTitleHeading";
import { Step, Stepper } from "react-form-stepper";

export default function EditClientVideoQA() {
  const location = useLocation();

  const navigate = useNavigate();

  if (!location) {
    return <Navigate to="/" replace />;
  }

  const [ifVaildateBtnDisable, setIfVaildateBtnDisable] = useState(false);

  const [formType, setFormType] = useState({
    activeStep: 0,
    completedSteps: [false],
    formStep: 0,
    ifVaildateBtnDisable: false,
    nextBtnDisable: true,
    SubmitEventDisabled: false,
  });

  const { SubmitEventDisabled } = formType;

  const [page, setPage] = useState(1);

  const { FormMode, videoLink, videoID } = location?.state;

  const videoRef = useRef(null);

  const [ifBtnDisable, setIfBtnDisable] = useState(true);

  const [isLoading, setIsLoading] = useState(true);

  const [tempVideoQA, setTempVideoQA] = useState([]);

  const [tempVideoInfo, setTempVideoInfo] = useState([]);

  useEffect(() => {
    if (tempVideoInfo.length > 0) {
      handlePrevData();
    }
  }, [tempVideoInfo]);

  // 取得先前資料
  const handlePrevData = () => {
    tempVideoInfo.forEach((info) => {
      if (info?.video_is_question === 1) {
        if (info?.option_3 !== undefined && info?.option_4 !== undefined) {
          const optionNum = 4;
          setTempVideoQA((prevVideoQA) => [
            ...prevVideoQA,
            {
              id: info?.quiz_id,
              currentTime: info?.video_interrupt_time,
              durationTime: info?.video_duration,
              messageType: info?.video_is_question,
              mustCorrectQuestion: info?.video_must_correct,
              questionContent: info?.video_question,
              numofOptions: optionNum,
              answerContent: [
                [info?.option_1[1], info?.option_1[0]],
                [info?.option_2[1], info?.option_2[0]],
                [info?.option_3[1], info?.option_3[0]],
                [info?.option_4[1], info?.option_4[0]],
              ],
            },
          ]);
        } else if (
          info?.option_3 !== undefined &&
          info?.option_4 === undefined
        ) {
          const optionNum = 3;
          setTempVideoQA((prevVideoQA) => [
            ...prevVideoQA,
            {
              id: info?.quiz_id,
              currentTime: info?.video_interrupt_time,
              durationTime: info?.video_duration,
              messageType: info?.video_is_question,
              mustCorrectQuestion: info?.video_must_correct,
              questionContent: info?.video_question,
              numofOptions: optionNum,
              answerContent: [
                [info?.option_1[1], info?.option_1[0]],
                [info?.option_2[1], info?.option_2[0]],
                [info?.option_3[1], info?.option_3[0]],
              ],
            },
          ]);
        } else {
          const optionNum = 2;
          setTempVideoQA((prevVideoQA) => [
            ...prevVideoQA,
            {
              id: info?.quiz_id,
              currentTime: info?.video_interrupt_time,
              durationTime: info?.video_duration,
              messageType: info?.video_is_question,
              mustCorrectQuestion: info?.video_must_correct,
              questionContent: info?.video_question,
              numofOptions: optionNum,
              answerContent: [
                [info?.option_1[1], info?.option_1[0]],
                [info?.option_2[1], info?.option_2[0]],
              ],
            },
          ]);
        }
      } else {
        setTempVideoQA((prevVideoQA) => [
          ...prevVideoQA,
          {
            id: info?.quiz_id,
            currentTime: info?.video_interrupt_time,
            durationTime: info?.video_duration,
            messageType: info?.video_is_question,
            questionContent: info?.video_question,
            answerContent: [],
          },
        ]);
      }
    });
  };

  async function fetchVideoData({ api }) {
    try {
      const response = await get(api);
      const VideoInfo = await response.data.data;
      setTempVideoInfo(VideoInfo);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let ignore = false;

    const fetchVideoDataAsync = async () => {
      await fetchVideoData({ api: `videoQA/${videoID}` });
    };

    if (!ignore) {
      fetchVideoDataAsync();
    }

    return () => {
      ignore = true;
    };
  }, []);

  const handleGetVideoTime = (index, e) => {
    setIfBtnDisable(true);
    if (videoRef.current) {
      setTempVideoQA(
        update(
          `${index}.currentTime`,
          () => videoRef.current.currentTime,
          tempVideoQA
        )
      );
    }
  };
  // 若該欄位的持續時間有所變動
  const handleGetVideoDuration = (index, e) => {
    setIfBtnDisable(true);
    // if user have any change in the video duration then the setTempVideoQA will be update
    setTempVideoQA(
      update(`${index}.durationTime`, () => e.target.value, tempVideoQA)
    );
  };

  // if radio box is checked then the information of the Question mustCorrect will be true
  const handleGetQuestionMustCorrect = (index, e) => {
    setIfBtnDisable(true);
    setTempVideoQA(
      update(
        `${index}.mustCorrectQuestion`,
        (value) => (!value === true ? 1 : 0),
        tempVideoQA
      )
    );
  };

  //取得問題填寫內容變動
  const handleGetQuestionContent = (index, e) => {
    setIfBtnDisable(true);
    setTempVideoQA(
      update(`${index}.questionContent`, () => e.target.value, tempVideoQA)
    );
  };
  // 取得答題選項數目變動
  const handleOptionChange = (index, e) => {
    setIfBtnDisable(true);
    const numOfChoice = parseInt(e.target.value);
    setTempVideoQA(
      update(
        index,
        (question) => ({
          ...question,
          answerContent: Array.from({ length: numOfChoice }, () => [false, ""]),
          numofOptions: numOfChoice,
        }),
        tempVideoQA
      )
    );
  };

  const handleIsCorrectOption = (questionindex, answerOptionIndex) => {
    setIfBtnDisable(true);
    const newVideoQA = [...tempVideoQA];
    const currentOption = newVideoQA[questionindex].answerContent;

    const updateAnswerOption = currentOption.map((answer, index) => {
      if (index === answerOptionIndex) {
        // console.log([!answer[0], answer[1]]);
        return [!answer[0], answer[1]];
      }
      return [false, answer[1]];
    });
    newVideoQA[questionindex].answerContent = updateAnswerOption;
    setTempVideoQA(newVideoQA);
  };

  const handleAnswerChange = (index, answerContentIndex, e) => {
    setIfBtnDisable(true);
    const newVideoQA = [...tempVideoQA];
    newVideoQA[index].answerContent[answerContentIndex][1] = e.target.value;
    setTempVideoQA(newVideoQA);
  };

  const handleCheckMessageType = (index, e) => {
    setIfBtnDisable(true);
    setTempVideoQA(
      update(
        `${index}.messageType`,
        () => (e.target.value === "1" ? 1 : 0),
        tempVideoQA
      )
    );

    setTempVideoQA((prevVideoQA) => {
      const updatedVideoQA = [...prevVideoQA];
      if (e.target.value === "0") {
        updatedVideoQA[index].answerContent = [];
        updatedVideoQA[index].numofOptions = 0;
      }
      return updatedVideoQA;
    });
  };

  // 增加/刪減 影片問題輸入框...
  // 增加輸入欄位
  const handleAddQuestion = () => {
    setIfBtnDisable(true);
    // get the last question index
    const lastQuestionIndex = tempVideoQA.length - 1;
    // get the last question duration time
    const lastQuestionQuizIndex = tempVideoQA[lastQuestionIndex].id;
    // add the new index
    let newQuestionIndex = lastQuestionQuizIndex + 1;

    setTempVideoQA([
      ...tempVideoQA,
      {
        id: newQuestionIndex,
        currentTime: 0,
        durationTime: 0,
        messageType: FormMode === 0 ? 0 : 1,
        mustCorrectQuestion: false,
        questionContent: "",
        numofOptions: 0,
        answerContent: [],
      },
    ]);
  };

  // 刪減輸入欄位
  const handleDelQAMessage = (index) => {
    setIfBtnDisable(true);
    setTempVideoQA((prevVideoQA) => prevVideoQA.filter((_, i) => i !== index));
  };

  // 驗證問題/選項/答案是否為空
  const validateQA = () => {
    let ifAnyAnswerContentIsEmpty = false;

    const durationTimeIsEmptyOrZero = tempVideoQA.some(
      (info) => info.durationTime === 0 || info.durationTime === ""
    );

    const questionIsEmpty = tempVideoQA.some((info) => !info.questionContent);

    const ifAnyArrayOptionIndicesIsEmpty = tempVideoQA.reduce(
      (acc, curr, index) => {
        if (curr.messageType === 1) {
          if (curr.answerContent.length === 0) {
            acc.push(index);
          } else if (curr.answerContent.some((value) => value[1] === "")) {
            ifAnyAnswerContentIsEmpty = true;
          }
        }
        return acc;
      },
      []
    );
    setIfBtnDisable(true);
    setIfVaildateBtnDisable(true);
    if (
      durationTimeIsEmptyOrZero ||
      questionIsEmpty ||
      ifAnyArrayOptionIndicesIsEmpty.length > 0 ||
      ifAnyAnswerContentIsEmpty
    ) {
      if (durationTimeIsEmptyOrZero) {
        toast.error("請確認影片問題中斷時間是否為空或為0");
      } else {
        toast.error("問題或答案欄位選項不得為空");
      }
      setIfBtnDisable(true);
      setTimeout(() => {
        setIfVaildateBtnDisable(false);
      }, 4000);
    } else {
      setIfBtnDisable(false);
      setIfVaildateBtnDisable(false);
    }
  };

  const SubmitEvent = () => {
    async function fetchEditVideoData(data) {
      let quizSubmit = toast.loading("資料上傳中...");
      try {
        const response = await put(`video/${videoID}`, data);
        const VideoInfo = await response.data;
        toast.update(quizSubmit, {
          render: "資料更新成功",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/Home", { replace: true });
        }, 3000);
      } catch (error) {
        console.log(error);
        toast.update(quizSubmit, {
          render: "資料更新失敗",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
    const data = {
      info: tempVideoQA,
    };
    // console.log(data);
    fetchEditVideoData(data);
  };

  const FormStep = (step) => {
    switch (step) {
      case 0:
        return (
          <Container>
            <Row>
              <Col className="d-flex justify-content-center" lg={6}>
                <div>
                  <video
                    ref={videoRef}
                    src={videoLink}
                    className={`${styles.videoPreview}`}
                    width="80%"
                    controls
                  />
                </div>
              </Col>
              <Col>
                <Stack gap={2}>
                  <div>
                    <h2>
                      <strong>{`請填寫衛教${
                        FormMode ? "測驗用" : "練習用"
                      }影片問題`}</strong>
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

                <DynamicQuestionandAnswer
                  FormMode={FormMode === 0 ? false : true}
                  VideoQA={tempVideoQA}
                  handleDelQAMessage={handleDelQAMessage}
                  handleGetVideoTime={handleGetVideoTime}
                  handleGetVideoDuration={handleGetVideoDuration}
                  handleCheckMessageType={handleCheckMessageType}
                  handleGetQuestionMustCorrect={handleGetQuestionMustCorrect}
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
                  btnPosition="ms-2"
                  btnSize="lg"
                  btnName={"formStep"}
                  text={"驗證此頁面表單"}
                  onClickEventName={validateQA}
                  disabled={ifVaildateBtnDisable}
                  variant="outline-success"
                />
                <BtnBootstrap
                  btnPosition="ms-2  float-end"
                  btnSize="lg"
                  btnName="formStep"
                  variant="outline-primary"
                  text={"預覽表單"}
                  onClickEventName={() => {
                    setFormType((prevState) => ({
                      ...prevState,
                      formStep: prevState.formStep + 1,
                      nextBtnDisable: true,
                    }));
                  }}
                  disabled={ifBtnDisable}
                />
              </Col>
            </Row>
            <ToastAlert />
          </Container>
        );
      case 1:
        return (
          <Container>
            {tempVideoQA?.map((q, i) => (
              <Card key={i} className="mb-2">
                <Card.Title className="mb-2 ms-1">問題 {i + 1}:</Card.Title>
                <Container>
                  {q.mustCorrectQuestion === 1 && (
                    <Row className="text-danger">
                      <Col className="h5 ps-0" md={4}>
                        &#9956;此為必定答對問題&#9956;
                      </Col>
                    </Row>
                  )}

                  <Row>
                    <Col
                      className={`h5 ps-0 ${
                        q.messageType === 1 ? "text-success" : "text-danger"
                      }`}
                      md={4}
                    >
                      {q.messageType === 0 ? "提示訊息:" : "問題內容:"}
                    </Col>
                    <Col md={6}>{q.questionContent}</Col>
                  </Row>
                </Container>
                {q.messageType === 1 &&
                  q.answerContent.map((a, j) => (
                    <div key={`${i}-${j}`}>
                      <Card.Title className="ms-2">{`答案${String.fromCharCode(
                        65 + j
                      )}:`}</Card.Title>
                      <Card.Text
                        className={`ms-4 ${
                          a[0] ? "text-success" : "text-danger"
                        }`}
                      >{`${a[1]}-答案為${a[0] ? "正確" : "錯誤"}`}</Card.Text>
                    </div>
                  ))}
              </Card>
            ))}

            <Stack gap={2} className="col-md-5 mx-auto">
              <BtnBootstrap
                btnPosition=""
                btnName="formStep"
                btnSize="md"
                disabled={SubmitEventDisabled}
                text={"送出表單"}
                onClickEventName={SubmitEvent}
                variant="outline-primary"
              />
              <BtnBootstrap
                btnPosition=""
                btnName={"formStep"}
                btnSize="md"
                text={"上一步"}
                onClickEventName={() => {
                  setFormType((prevState) => ({
                    ...prevState,
                    formStep: prevState.formStep - 1,
                    nextBtnDisable: true,
                  }));
                }}
                variant={"outline-danger"}
              />
            </Stack>
          </Container>
        );
      default:
        return;
    }
  };

  if (isLoading) {
    return (
      <LoadingComponent
        title="台大分院雲林分院 編輯表單系統"
        text="問題資訊載入中"
      />
    );
  }
  return (
    <Container>
      <PageTitle title={`台大醫院雲林分院｜基礎練習用表單`} />
      <PageTitleHeading
        text={`${FormMode === 1 ? "測驗用" : "練習用"}表單系統`}
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
          label="填寫影片問題"
          onClick={() => {
            setFormType({ ...formType, formStep: 0 });
          }}
          completed={formType.completedSteps[0]}
        />
        <Step label="表單預覽" disabled={true} />
      </Stepper>
      {FormStep(formType.formStep)}
      <ToastAlert />
    </Container>
  );
}
