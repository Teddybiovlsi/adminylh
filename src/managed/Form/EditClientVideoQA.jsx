import React, { useState, useRef, useEffect } from "react";
import { Card, Stack } from "react-bootstrap";
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

export default function EditClientVideoQA({ FormMode = true }) {
  const location = useLocation();

  const navigate = useNavigate();

  if (!location) {
    return <Navigate to="/" replace />;
  }
  const [page, setPage] = useState(1);

  const videoLink = location?.state?.videoLink;

  const videoRef = useRef(null);

  const [ifBtnDisable, setIfBtnDisable] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const [tempVideoQA, setTempVideoQA] = useState([]);

  const [tempVideoInfo, setTempVideoInfo] = useState([]);

  const [shouldRedirect, setShouldRedirect] = useState(false);

  // 回到上一頁
  const GoPrevPage = () => {
    setPage(page - 1);
  };

  // 預覽表單頁面
  const GoPriviewPage = () => {
    setPage(page + 1);
  };
  // 取得先前資料
  const handlePrevData = () => {
    tempVideoInfo.forEach((info) => {
      if (info?.option_3[0] !== null && info?.option_4[0] !== null) {
        const optionNum = 4;

        setTempVideoQA((prevVideoQA) => [
          ...prevVideoQA,
          {
            id: info?.quiz_id,
            currentTime: info?.video_interrupt_time,
            durationTime: info?.video_duration,
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
      } else if (info?.option_3[0] !== null && info?.option_4[0] == null) {
        const optionNum = 3;
        setTempVideoQA((prevVideoQA) => [
          ...prevVideoQA,
          {
            id: info?.quiz_id,
            currentTime: info?.video_interrupt_time,
            durationTime: info?.video_duration,
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
    });
  };

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      handlePrevData();
    }
    return () => {
      ignore = true;
    };
  }, [tempVideoInfo]);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      async function fetchVideoData({ api }) {
        try {
          setIsLoading(true);
          const response = await get(api);
          const VideoInfo = await response.data.data;
          setTempVideoInfo(VideoInfo);

          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        } catch (error) {
          console.log(error);
        }
      }

      fetchVideoData({
        api: `videoQA/${location?.state?.videoID}`,
      });
    }

    return () => {
      ignore = true;
    };
  }, []);

  const handleGetVideoTime = (index, e) => {
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
    // if user have any change in the video duration then the setTempVideoQA will be update
    setTempVideoQA(
      update(`${index}.durationTime`, () => e.target.value, tempVideoQA)
    );
  };

  // if radio box is checked then the information of the Question mustCorrect will be true
  const handleGetQuestionMustCorrect = (index, e) => {
    setTempVideoQA(
      update(`${index}.mustCorrectQuestion`, (value) => !value, tempVideoQA)
    );
  };

  //取得問題填寫內容變動
  const handleGetQuestionContent = (index, e) => {
    setTempVideoQA(
      update(`${index}.questionContent`, () => e.target.value, tempVideoQA)
    );
  };
  // 取得答題選項數目變動
  const handleOptionChange = (index, e) => {
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
    const newVideoQA = [...tempVideoQA];
    newVideoQA[index].answerContent[answerContentIndex][1] = e.target.value;
    setTempVideoQA(newVideoQA);
  };

  // 增加/刪減 影片問題輸入框...
  // 增加輸入欄位
  const handleAddQuestion = () => {
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
        mustCorrectQuestion: false,
        questionContent: "",
        numofOptions: 0,
        answerContent: [],
      },
    ]);
  };

  // 刪減輸入欄位
  const handleDelQAMessage = (index) => {
    setTempVideoQA((prevVideoQA) => prevVideoQA.filter((_, i) => i !== index));
  };

  // 驗證問題/選項/答案是否為空
  const validateQA = () => {
    let ifAnyAnswerContentIsEmpty = false;

    const questionIsEmpty = tempVideoQA.some((info) => !info.questionContent);

    const ifAnyArrayOptionIndicesIsEmpty = tempVideoQA.reduce(
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
      setIfBtnDisable(true);
    } else {
      setIfBtnDisable(false);
    }
  };

  const SubmitEvent = () => {
    // /v1/PUT/video/{videoID}
    const videoID = location?.state?.videoID;
    async function fetchEditVideoData(data) {
      let quizSubmit = toast.loading("資料上傳中...");
      try {
        // console.log(data);
        const response = await put(`video/${videoID}`, data);
        const VideoInfo = await response.data;
        toast.update(quizSubmit, {
          render: "資料更新成功",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setTimeout(() => {
          setShouldRedirect(true);
        }, 3000);
      } catch (error) {
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

    fetchEditVideoData(data);
    // console.log(tempVideoQA);
  };

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/", { replace: true });
    }
  }, [shouldRedirect]);

  if (isLoading) {
    return <LoadingComponent title="台大分院雲林分院 編輯表單系統" />;
  }
  switch (page) {
    case 1:
      return (
        <div className="FormStyle d-flex align-items-center justify-content-center">
          <PageTitle title={`台大分院雲林分院｜ 編輯表單系統`} />
          <Card className={`${styles.ExamQusetionCard}`}>
            <Card.Title className={styles.FormTitle} style={{ margin: 0 }}>
              <CardTitleFunction TitleName={`台大醫院雲林分院`} />
              <CardTitleFunction TitleName={`編輯表單系統`} />
            </Card.Title>

            <Card.Body className="pt-0 ps-0 pe-0">
              <video ref={videoRef} src={videoLink} width="100%" controls />
              <Stack direction="horizontal" className="ms-2 mt-3 mb-3 me-2">
                <div>
                  <h2>
                    <strong>{`請填寫衛教${
                      FormMode ? "測驗用" : "練習用"
                    }影片問題`}</strong>
                  </h2>
                </div>

                <div className="ms-auto">
                  <BtnBootstrap
                    text={"新增問題"}
                    onClickEventName={handleAddQuestion}
                    variant="secondary"
                  />
                </div>
              </Stack>

              <DynamicQuestionandAnswer
                FormMode={FormMode}
                VideoQA={tempVideoQA}
                handleDelQAMessage={handleDelQAMessage}
                handleGetVideoTime={handleGetVideoTime}
                handleGetVideoDuration={handleGetVideoDuration}
                handleGetQuestionMustCorrect={handleGetQuestionMustCorrect}
                handleGetQuestionContent={handleGetQuestionContent}
                handleOptionChange={handleOptionChange}
                handleIsCorrectOption={handleIsCorrectOption}
                handleAnswerChange={handleAnswerChange}
              />
            </Card.Body>
            <Card.Footer>
              <BtnBootstrap
                btnPosition="ms-2  float-end"
                btnName={"formStep"}
                text={"預覽表單"}
                onClickEventName={GoPriviewPage}
                variant="primary"
                disabled={ifBtnDisable}
              />
              <BtnBootstrap
                btnPosition="ms-2  float-end"
                btnName={"formStep"}
                text={"驗證此頁面表單"}
                onClickEventName={validateQA}
                variant="success"
              />
            </Card.Footer>
          </Card>
        </div>
      );
    case 2:
      return (
        <div className="FormStyle d-flex align-items-center justify-content-center">
          <PageTitle title={`台大分院雲林分院｜ 編輯表單系統`} />
          <Card className={`${styles.ExamQusetionCard}`}>
            <Card.Title className={styles.FormTitle} style={{ margin: 0 }}>
              <CardTitleFunction TitleName={`台大醫院雲林分院`} />
              <CardTitleFunction TitleName={`預覽表單`} />
            </Card.Title>

            <Card.Body className="pt-0 ps-0 pe-0">
              {tempVideoQA?.map((questionInfo, questionIndex) => (
                <Card key={questionIndex} className="mb-2">
                  <Card.Title className="mb-2 ms-1">
                    問題 {questionIndex + 1}:
                  </Card.Title>

                  <Card.Title className="ms-2">中斷時間:</Card.Title>
                  <Card.Text className="ms-4">
                    {questionInfo.currentTime}秒
                  </Card.Text>

                  <Card.Title className="ms-2">問題內容:</Card.Title>
                  <Card.Text className="ms-4">
                    {questionInfo.questionContent}
                  </Card.Text>

                  <Card.Title className="ms-2">是否為必定答對問題?</Card.Title>
                  <Card.Text className="ms-4">
                    {questionInfo.mustCorrectQuestion ? "是" : "否"}
                  </Card.Text>

                  {questionInfo.answerContent.map(
                    (answerContent, answerContentIndex) => (
                      <div key={`${questionIndex}-${answerContentIndex}`}>
                        <Card.Title className="ms-2">{`答案${String.fromCharCode(
                          65 + answerContentIndex
                        )}:`}</Card.Title>
                        <Card.Text className="ms-4">{`${
                          answerContent[1]
                        }-答案為${
                          answerContent[0] ? "正確" : "錯誤"
                        }`}</Card.Text>
                      </div>
                    )
                  )}
                </Card>
              ))}
            </Card.Body>
            <Card.Footer>
              <BtnBootstrap
                btnName={"formStep"}
                text={"送出表單"}
                onClickEventName={SubmitEvent}
                variant={"primary"}
              />
              <BtnBootstrap
                btnName={"formStep"}
                text={"上一步"}
                onClickEventName={GoPrevPage}
                variant={"danger"}
              />
            </Card.Footer>
          </Card>
          <ToastAlert />
        </div>
      );
    default:
      return <Navigate to="/" replace />;
  }
}
