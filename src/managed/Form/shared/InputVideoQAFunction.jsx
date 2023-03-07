import React, { useState, useRef, useEffect } from "react";
import { Card, Stack } from "react-bootstrap";
import PageTitle from "../../../shared/Title";
import { CardTitleFunction } from "./CardTitleFunction";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import DynamicQuestionandAnswer from "./DynamicQuestionandAnswer";
import styles from "./scss/FormStyles.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { array } from "prop-types";

function InputVideoQAFunction({
  FormMode = false,
  FormStep = 0,
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
  // 若該欄位之index取得時間有變動
  const handleGetVideoTime = (index, e) => {
    if (videoRef.current) {
      const newVideoQA = [...VideoQA];
      newVideoQA[index].currentTime = videoRef.current.currentTime;
      setVideoQA(newVideoQA);
    }
  };
  // if radio box is checked then the information of the Question mustCorrect will be true
  const handleGetQuestionMustCorrect = (index, e) => {
    const newVideoQA = [...VideoQA];
    newVideoQA[index].mustCorrectQuestion =
      !newVideoQA[index].mustCorrectQuestion;
    setVideoQA(newVideoQA);
  };
  //取得問題內容變動
  const handleGetQuestionContent = (index, e) => {
    const newVideoQA = [...VideoQA];
    newVideoQA[index].questionContent = e.target.value;
    setVideoQA(newVideoQA);
  };
  // 取得答題選項數目變動
  const handleOptionChange = (index, e) => {
    const numOfChoice = parseInt(e.target.value);
    const newVideoQA = [...VideoQA];
    newVideoQA[index].answerContent = Array.from(
      { length: numOfChoice },
      () => [false, ""]
    );
    newVideoQA[index].numofOptions = numOfChoice;
    setVideoQA(newVideoQA);
  };

  const handleIsCorrectOption = (questionindex, answerOptionIndex) => {
    const newVideoQA = [...VideoQA];
    const currentOption = newVideoQA[questionindex].answerContent;

    // console.log(currentOption);
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
    const newVideoQA = [...VideoQA];
    newVideoQA.splice(index, 1);
    setVideoQA(newVideoQA);
  };

  const validateQA = (event) => {
    // 確認問題是否有被填入
    const questionIsEmpty = VideoQA.map((info) => info.questionContent).some(
      (value) => !value
    );
    // 確認答案選項是否有點選
    const ifAnswerOptionEmptyArray = VideoQA.map(
      (info) => info.answerContent
    ).map((array, index) => {
      const isEmpty = array.length === 0;
      return { index, isEmpty };
    });
    // 確認是哪一個index的選項未被點選
    const ifAnyArrayOptionIndicesIsEmpty = ifAnswerOptionEmptyArray
      .filter((item) => item.isEmpty)
      .map((item) => item.index);

    const ifAnyAnswerContentIsEmpty = VideoQA.map((info) => info.answerContent)
      .map((arr) => arr.some((value) => value[1] === ""))
      .some(Boolean);

    if (
      questionIsEmpty ||
      ifAnyArrayOptionIndicesIsEmpty.length > 0 ||
      ifAnyAnswerContentIsEmpty
    ) {
      setIfBtnDisable(true);
    } else {
      // 所有爛位皆都不為空，執行對應的處理邏輯
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
