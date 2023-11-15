import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row, Stack } from "react-bootstrap";
import PageTitle from "../../components/Title";
import { update } from "lodash/fp";
import BtnBootstrap from "../../components/BtnBootstrap";
import { useLocation, useNavigate } from "react-router-dom";
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
    completedSteps: [false],
    formStep: 0,
    ifVaildateBtnDisable: false,
    nextBtnDisable: true,
    SubmitEventDisabled: false,
  });

  const { nextBtnDisable, SubmitEventDisabled } = formType;

  const [videoInfo, setVideoInfo] = useState([]);

  const [tempVideoInfo, setTempVideoInfo] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [updateIndex, setUpdateIndex] = useState(null);

  // 計算分數比重
  const calculatePoint = (length) => Math.round((100 / length) * 10) / 10;
  // 計算剩餘分數比重
  const calculateElseIndexAndPoint = () => {
    const elseIndex = updateIndex === 0 ? 1 : 0;
    const elsePoint = 100 - videoInfo[updateIndex].questionPoint;
    return { elseIndex, elsePoint };
  };

  useEffect(() => {
    if (updateIndex === null) return;

    const totalInfo = videoInfo.length;

    if (totalInfo === 2) {
      const { elseIndex, elsePoint } = calculateElseIndexAndPoint();

      setVideoQA(
        update(`${elseIndex}.questionPoint`, () => elsePoint, videoInfo)
      );

      setUpdateIndex(null);
    }
  }, [videoInfo]);

  useEffect(() => {
    if (tempVideoInfo.length > 0) {
      handlePrevData();
      setIsLoading(false);
    }
  }, [tempVideoInfo]);

  // 取得問題分數比重變動
  const handleGetQuestionPointChange = (index, e) => {
    if (
      parseFloat(e.target.value) > 100 ||
      parseFloat(e.target.value) < 0 ||
      e.target.value === ""
    ) {
      setUpdateIndex(index);
      setVideoInfo(update(`${index}.questionPoint`, () => 1, videoInfo));
    } else {
      // 取得目前點擊的分數比重
      const point = parseFloat(e.target.value);

      setUpdateIndex(index);
      setVideoInfo(update(`${index}.questionPoint`, () => point, videoInfo));
    }
  };

  // 取得圖片上傳變動
  const handleGetQuestionImage = (index, answerContentIndex, e) => {
    console.log(index);
    const newVideoQA = [...videoInfo];
    newVideoQA[index].answerFile[answerContentIndex] = e.target.files[0];
    setVideoInfo(newVideoQA);
  };
  // 處理先前資料
  const handlePrevData = () => {
    tempVideoInfo.forEach((info) => {
      if (info?.option_3 !== undefined && info?.option_4 !== undefined) {
        const optionNum = 4;
        setVideoInfo((prevVideoQA) => [
          ...prevVideoQA,
          {
            id: info?.id,
            questionContent: info?.video_question,
            questionPoint: info?.video_question_point,
            numofOptions: optionNum,
            answerFile: [
              info?.option_1_pic_path,
              info?.option_2_pic_path,
              info?.option_3_pic_path,
              info?.option_4_pic_path,
            ],
            answerContent: [
              [info?.option_1[1], info?.option_1[0]],
              [info?.option_2[1], info?.option_2[0]],
              [info?.option_3[1], info?.option_3[0]],
              [info?.option_4[1], info?.option_4[0]],
            ],
          },
        ]);
      } else if (info?.option_3 !== undefined && info?.option_4 === undefined) {
        const optionNum = 3;
        setVideoInfo((prevVideoQA) => [
          ...prevVideoQA,
          {
            id: info?.id,
            questionContent: info?.video_question,
            questionPoint: info?.video_question_point,
            numofOptions: optionNum,
            answerFile: [
              info?.option_1_pic_path,
              info?.option_2_pic_path,
              info?.option_3_pic_path,
            ],
            answerContent: [
              [info?.option_1[1], info?.option_1[0]],
              [info?.option_2[1], info?.option_2[0]],
              [info?.option_3[1], info?.option_3[0]],
            ],
          },
        ]);
      } else {
        const optionNum = 2;
        setVideoInfo((prevVideoQA) => [
          ...prevVideoQA,
          {
            id: info?.id,
            questionContent: info?.video_question,
            questionPoint: info?.video_question_point,
            numofOptions: optionNum,
            answerFile: [info?.option_1_pic_path, info?.option_2_pic_path],
            answerContent: [
              [info?.option_1[1], info?.option_1[0]],
              [info?.option_2[1], info?.option_2[0]],
            ],
          },
        ]);
      }
    });
  };

  async function fetchBasicVideoData({ api }) {
    try {
      const response = await get(api);
      const videoInfo = response.data.data;

      setTempVideoInfo((prevVideoQA) => [...prevVideoQA, ...videoInfo]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let ignore = false;

    const fetchBasicVideoDataAsync = async () => {
      await fetchBasicVideoData({
        api: `basic/videoQA/${location?.state?.videoID}`,
      });
    };

    if (!ignore && haveQuestion) {
      fetchBasicVideoDataAsync();
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
    // get the last question index
    const lastQuestionIndex = videoInfo.length - 1;

    if (lastQuestionIndex === -1) {
      setFormType({ ...formType, nextBtnDisable: true });
      setVideoInfo([
        ...videoInfo,
        {
          id: 0,
          questionContent: "",
          questionPoint: 100,
          numofOptions: 0,
          answerContent: [],
        },
      ]);
    } else {
      // get the last question duration time
      const lastQuestionQuizIndex = videoInfo[lastQuestionIndex].id;
      // add the new index
      let newQuestionIndex = lastQuestionQuizIndex + 1;

      const videoQuestionLength = videoInfo.length + 1;
      // 重新計算每一題分數比重
      const point = calculatePoint(videoQuestionLength);

      setFormType({ ...formType, nextBtnDisable: true });
      setVideoInfo((prevVideoQA) => [
        ...prevVideoQA.map((info) => ({
          ...info,
          questionPoint: point,
        })),
        {
          id: newQuestionIndex,
          questionContent: "",
          questionPoint: point,
          numofOptions: 0,
          answerContent: [],
        },
      ]);
    }
  };

  // 刪減輸入欄位
  const handleDelQAMessage = (index) => {
    setFormType({ ...formType, nextBtnDisable: true });
    setVideoInfo((prevVideoQA) => {
      const newVideoQA = prevVideoQA.filter((_, i) => i !== index);
      const point = calculatePoint(newVideoQA.length);

      return newVideoQA.map((info) => ({
        ...info,
        questionPoint: point,
      }));
    });
  };

  //取得問題填寫內容變動
  const handleGetQuestionContent = (index, e) => {
    setFormType({ ...formType, nextBtnDisable: true });
    setVideoInfo(
      update(`${index}.questionContent`, () => e.target.value, videoInfo)
    );
  };

  // 取得答題選項數目變動
  const handleOptionChange = (index, e) => {
    setFormType({ ...formType, nextBtnDisable: true });
    const numOfChoice = parseInt(e.target.value);
    setVideoInfo(
      update(
        index,
        (question) => ({
          ...question,
          answerContent: Array.from({ length: numOfChoice }, () => [false, ""]),
          answerFile: Array.from({ length: numOfChoice }, () => null),
          numofOptions: numOfChoice,
        }),
        videoInfo
      )
    );
  };

  //   取得答題正確答案變動
  const handleIsCorrectOption = (questionindex, answerOptionIndex) => {
    const newVideoQA = [...videoInfo];
    const currentOption = newVideoQA[questionindex].answerContent;

    setFormType({ ...formType, nextBtnDisable: true });
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
    setFormType({ ...formType, nextBtnDisable: true });
    const newVideoQA = [...videoInfo];
    newVideoQA[index].answerContent[answerContentIndex][1] = e.target.value;
    setVideoInfo(newVideoQA);
  };

  // 驗證問題/選項/答案是否為空
  const validateQA = () => {
    let ifAnyAnswerContentIsEmpty = false;
    setFormType({ ...formType, ifVaildateBtnDisable: true });

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

    if (
      questionIsEmpty ||
      ifAnyArrayOptionIndicesIsEmpty.length > 0 ||
      ifAnyAnswerContentIsEmpty
    ) {
      setFormType({ ...formType, nextBtnDisable: true });
      toast.error("問題或答案欄位選項不得為空");
      setTimeout(() => {
        setFormType({ ...formType, ifVaildateBtnDisable: false });
      }, 4000);
    } else {
      setFormType({
        ...formType,
        ifVaildateBtnDisable: false,
        nextBtnDisable: false,
      });
    }
  };

  const SubmitEvent = () => {
    // /v1/PUT/video/{videoID}
    const videoID = location?.state?.videoID;
    async function fetchEditVideoData(data) {
      const editNewQA = toast.loading("資料上傳中...");
      try {
        const response = await put(`basic/video/${videoID}`, data);
        const VideoInfo = await response.data;
        toast.update(editNewQA, {
          render: "資料更新成功",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 3000);
      } catch (error) {
        console.log(error);
        console.log(error.response.data);
        toast.update(editNewQA, {
          render: "資料更新失敗",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
    const data = {
      info: videoInfo,
    };
    fetchEditVideoData(data);
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
                  VideoQA={videoInfo?.length > 0 ? videoInfo : null}
                  handleDelQAMessage={handleDelQAMessage}
                  handleGetQuestionPointChange={handleGetQuestionPointChange}
                  handleGetQuestionImage={handleGetQuestionImage}
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
                  onClickEventName={() => {
                    setFormType((prevState) => ({
                      ...prevState,
                      isSkipped: false,
                      checkFormQuestion: true,
                      completedSteps: prevState.completedSteps.map(
                        (step, index) =>
                          index === prevState.formStep ? true : step
                      ),
                      formStep: prevState.formStep + 1,
                    }));
                  }}
                  disabled={nextBtnDisable}
                />
              </Col>
            </Row>
          </Container>
        );
      case 1:
        return (
          <Container>
            {videoInfo?.map((q, i) => (
              <Card key={i} className="mb-2">
                <Card.Title className="mb-2 ms-1">問題 {i + 1}:</Card.Title>
                <Container>
                  <Row>
                    <Col className="h5 ps-0 ms-2" md={4}>
                      問題內容:
                    </Col>
                    <Col md={6}>{q.questionContent}</Col>
                  </Row>
                  <Row>
                    <Col className="h5 ps-0 ms-2" md={4}>
                      問題對應分數:
                    </Col>
                    <Col md={6}>
                      <b>{q.questionPoint}</b>分
                    </Col>
                  </Row>
                </Container>
                {q.answerContent.map((a, j) => (
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
