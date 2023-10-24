import React, { useState, useRef, useEffect } from "react";
import { Card, Col, Container, Row, Stack } from "react-bootstrap";
import PageTitle from "../../../components/Title";
import { CardTitleFunction } from "./CardTitleFunction";
import { update } from "lodash/fp";
import BtnBootstrap from "../../../components/BtnBootstrap";
import DynamicQuestionandAnswer from "./DynamicQuestionAndAnswer";
import styles from "../../../styles/Form/FormStyles.module.scss";
import ToastAlert from "../../../components/ToastAlert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BasicDynamicQuestionAndAnswer from "./BasicDynamicQuestionAndAnswer";

export default function InputVideoBasicQAFunction({
  // 輸入影片問題的相關變數
  VideoQA,
  setVideoQA,
  // 表單模式和下一步事件的相關變數
  isBasicVideo = false,
  GoNextEvent = null,
  GoPrevEvent = null,
}) {
  const [ifVaildateBtnDisable, setIfVaildateBtnDisable] = useState(false);

  const [ifBtnDisable, setIfBtnDisable] = useState(true);

  //取得問題填寫內容變動
  const handleGetQuestionContent = (index, e) => {
    setIfBtnDisable(true);
    setVideoQA(
      update(`${index}.questionContent`, () => e.target.value, VideoQA)
    );
  };
  // 取得答題選項數目變動
  const handleOptionChange = (index, e) => {
    setIfBtnDisable(true);
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

    setIfBtnDisable(true);
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
    setIfBtnDisable(true);
    const newVideoQA = [...VideoQA];
    newVideoQA[index].answerContent[answerContentIndex][1] = e.target.value;
    setVideoQA(newVideoQA);
  };

  // 增加/刪減 影片問題輸入框...
  // 增加輸入欄位
  const handleAddQuestion = () => {
    setIfBtnDisable(true);
    setVideoQA([
      ...VideoQA,
      {
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
    setIfVaildateBtnDisable(true);

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
      toast.error("問題或答案欄位選項不得為空");
      setTimeout(() => {
        setIfVaildateBtnDisable(false);
      }, 4000);
    } else {
      setIfVaildateBtnDisable(false);
      setIfBtnDisable(false);
    }
  };

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
            VideoQA={VideoQA}
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
            btnName="formStep"
            variant="outline-danger"
            text={"上一步"}
            onClickEventName={GoPrevEvent}
          />
        </Col>
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
            onClickEventName={GoNextEvent}
            disabled={ifBtnDisable}
          />
        </Col>
      </Row>
      <ToastAlert />
    </Container>
  );
}
