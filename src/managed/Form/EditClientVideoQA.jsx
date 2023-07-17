import React, { useState, useRef, useEffect } from "react";
import { Card, Stack } from "react-bootstrap";
import PageTitle from "../../components/Title";
import { CardTitleFunction } from "./shared/CardTitleFunction";
import { update } from "lodash/fp";
import BtnBootstrap from "../../components/BtnBootstrap";
import DynamicQuestionandAnswer from "./shared/DynamicQuestionandAnswer";
import styles from "../../styles/Form/FormStyles.module.scss";
import { Navigate, useLocation } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";
import { get } from "../axios";

export default function EditClientVideoQA({
  FormMode = false,
  GoPrevEvent = null,
  GoNextEvent = null,
}) {
  const location = useLocation();

  if (!location) {
    return <Navigate to="/" replace />;
  }

  const videoLink = location?.state?.videoLink;

  const videoRef = useRef(null);

  const [ifBtnDisable, setIfBtnDisable] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const [videoQA, setVideoQA] = useState([
    {
      currentTime: 0,
      durationTime: 0,
      mustCorrectQuestion: false,
      questionContent: "",
      numofOptions: 0,
      answerContent: [],
    },
  ]);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      async function fetchVideoData({ api }) {
        try {
          setIsLoading(true);
          const response = await get(api);
          const VideoInfo = await response.data.data;
          console.log(VideoInfo);
          setIsLoading(false);
          // setVideoQA(VideoInfo);
          // setIsLoading(false);
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

  // const fetchVideoQA = async () => {
  //   try {
  //     const response = await get(`video/${videoID}`);
  //   }
  // };

  const handleGetVideoTime = (index, e) => {
    if (videoRef.current) {
      setVideoQA(
        update(
          `${index}.currentTime`,
          () => videoRef.current.currentTime,
          videoQA
        )
      );
    }
  };
  // 若該欄位的持續時間有所變動
  const handleGetVideoDuration = (index, e) => {
    // if user have any change in the video duration then the setVideoQA will be update
    setVideoQA(update(`${index}.durationTime`, () => e.target.value, videoQA));
  };

  // if radio box is checked then the information of the Question mustCorrect will be true
  const handleGetQuestionMustCorrect = (index, e) => {
    setVideoQA(
      update(`${index}.mustCorrectQuestion`, (value) => !value, videoQA)
    );
  };

  //取得問題填寫內容變動
  const handleGetQuestionContent = (index, e) => {
    setVideoQA(
      update(`${index}.questionContent`, () => e.target.value, videoQA)
    );
  };
  // 取得答題選項數目變動
  const handleOptionChange = (index, e) => {
    const numOfChoice = parseInt(e.target.value);
    setVideoQA(
      update(
        index,
        (question) => ({
          ...question,
          answerContent: Array.from({ length: numOfChoice }, () => [false, ""]),
          numofOptions: numOfChoice,
        }),
        videoQA
      )
    );
  };

  const handleIsCorrectOption = (questionindex, answerOptionIndex) => {
    const newVideoQA = [...videoQA];
    const currentOption = newVideoQA[questionindex].answerContent;

    const updateAnswerOption = currentOption.map((answer, index) => {
      if (index === answerOptionIndex) {
        // console.log([!answer[0], answer[1]]);
        return [!answer[0], answer[1]];
      }
      return [false, answer[1]];
    });
    newVideoQA[questionindex].answerContent = updateAnswerOption;
    setVideoQA(newVideoQA);
  };

  const handleAnswerChange = (index, answerContentIndex, e) => {
    const newVideoQA = [...videoQA];
    newVideoQA[index].answerContent[answerContentIndex][1] = e.target.value;
    setVideoQA(newVideoQA);
  };

  // 增加/刪減 影片問題輸入框...
  // 增加輸入欄位
  const handleAddQuestion = () => {
    setVideoQA([
      ...videoQA,
      {
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
    setVideoQA((prevVideoQA) => prevVideoQA.filter((_, i) => i !== index));
  };

  // 驗證問題/選項/答案是否為空
  const validateQA = () => {
    let ifAnyAnswerContentIsEmpty = false;

    const questionIsEmpty = videoQA.some((info) => !info.questionContent);

    const ifAnyArrayOptionIndicesIsEmpty = videoQA.reduce(
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

  if (isLoading) {
    return <LoadingComponent title="台大分院雲林分院 編輯表單系統" />;
  }

  return (
    <div className="FormStyle d-flex align-items-center justify-content-center">
      <PageTitle
        title={`台大分院雲林分院｜ ${FormMode ? "測驗用表單" : "練習用表單"}`}
      />
      <Card className={`${styles.ExamQusetionCard}`}>
        <Card.Title className={styles.FormTitle} style={{ margin: 0 }}>
          <CardTitleFunction TitleName={`台大醫院雲林分院`} />
          <CardTitleFunction
            TitleName={`${FormMode ? "測驗用" : "練習用"}表單系統`}
          />
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
            VideoQA={videoQA}
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
            btnPosition="me-2"
            btnName={"formStep"}
            text={"上一步"}
            onClickEventName={GoPrevEvent}
            variant="danger"
          />

          <BtnBootstrap
            btnPosition="ms-2  float-end"
            btnName={"formStep"}
            text={"預覽表單"}
            onClickEventName={GoNextEvent}
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
}

// import React, { useState, useRef } from "react";
// import { Card, Stack } from "react-bootstrap";
// import PageTitle from "../../../components/Title";
// import { CardTitleFunction } from "./CardTitleFunction";
// import { update } from "lodash/fp";
// import BtnBootstrap from "../../../components/BtnBootstrap";
// import DynamicQuestionandAnswer from "./DynamicQuestionandAnswer";
// import styles from "../../../styles/Form/FormStyles.module.scss";

// function InputVideoQAFunction({
//   FormMode = false,
//   VideoFile = "",
//   videoQA,
//   setVideoQA,
//   GoPrevEvent = null,
//   GoNextEvent = null,
// }) {
//   const [ifBtnDisable, setIfBtnDisable] = useState(true);
//   // 影片時間參考欄位
//   const videoRef = useRef(null);
//   // 以下是跟影片問題/選項/答案填寫有關的欄位

//   // 若該欄位之index取得影片時間有所變動

// export default InputVideoQAFunction;
