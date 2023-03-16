import React, { useState, useRef } from "react";
import { Card, Stack } from "react-bootstrap";
import PageTitle from "../../../shared/Title";
import { CardTitleFunction } from "./CardTitleFunction";
import { update } from "lodash/fp";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import DynamicQuestionandAnswer from "./DynamicQuestionandAnswer";
import styles from "../../../styles/Form/FormStyles.module.scss";

function InputVideoQAFunction({
  FormMode = false,
  VideoFile = "",
  VideoQA,
  setVideoQA,
  GoPrevEvent = null,
  GoNextEvent = null,
}) {
  const [ifBtnDisable, setIfBtnDisable] = useState(true);
  // 影片時間參考欄位
  const videoRef = useRef(null);
  // 以下是跟影片問題/選項/答案填寫有關的欄位

  // 若該欄位之index取得影片時間有所變動
  const handleGetVideoTime = (index, e) => {
    if (videoRef.current) {
      setVideoQA(
        update(
          `${index}.currentTime`,
          () => videoRef.current.currentTime,
          VideoQA
        )
      );
    }
  };
  // if radio box is checked then the information of the Question mustCorrect will be true
  const handleGetQuestionMustCorrect = (index, e) => {
    setVideoQA(
      update(`${index}.mustCorrectQuestion`, (value) => !value, VideoQA)
    );
  };

  //取得問題填寫內容變動
  const handleGetQuestionContent = (index, e) => {
    setVideoQA(
      update(`${index}.questionContent`, () => e.target.value, VideoQA)
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
        VideoQA
      )
    );
  };

  const handleIsCorrectOption = (questionindex, answerOptionIndex) => {
    const newVideoQA = [...VideoQA];
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
    const newVideoQA = [...VideoQA];
    newVideoQA[index].answerContent[answerContentIndex][1] = e.target.value;
    setVideoQA(newVideoQA);
  };

  // 增加/刪減 影片問題輸入框...
  // 增加輸入欄位
  const handleAddQuestion = () => {
    setVideoQA([
      ...VideoQA,
      {
        currentTime: 0,
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

    const questionIsEmpty = VideoQA.some((info) => !info.questionContent);

    const ifAnyArrayOptionIndicesIsEmpty = VideoQA.reduce(
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
          <video
            ref={videoRef}
            src={VideoFile}
            className={`${styles.VideoPriview}`}
            width="100%"
            controls
          />
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
            VideoQA={VideoQA}
            handleDelQAMessage={handleDelQAMessage}
            handleGetVideoTime={handleGetVideoTime}
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

export default InputVideoQAFunction;
