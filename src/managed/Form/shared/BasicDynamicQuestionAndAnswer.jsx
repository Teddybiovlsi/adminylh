import React from "react";
import {
  Card,
  CloseButton,
  Form,
  InputGroup,
  FloatingLabel,
} from "react-bootstrap";
import styles from "../../../styles/Form/FormStyles.module.scss";

export default function BasicDynamicQuestionAndAnswer({
  VideoQA,
  handleDelQAMessage,
  handleGetQuestionContent,
  handleOptionChange,
  handleIsCorrectOption,
  handleAnswerChange,
}) {
  if (!VideoQA) return null;
  // 計算當前有幾個問題/警告訊息需要被填寫
  const totalInfo = VideoQA.length;

  return (
    <>
      {VideoQA.map((info, index) => (
        <Card key={index} style={{ position: "relative" }} className="mb-2">
          {totalInfo > 1 && (
            <CloseButton
              className={`${styles.deleteQAMessage}`}
              onClick={() => {
                handleDelQAMessage(index);
              }}
            />
          )}
          <Card.Title className="pt-3 ps-3 pe-3 pb-0">
            <h3>問題 {index + 1}</h3>
            <p className={`${styles.noticficationMessage}`}>
              <strong>若此為該問題答案請點選○</strong>
            </p>
          </Card.Title>
          <Card.Body>
            {/* In this inputGroup is about Question and Answer Select */}
            <InputGroup className="">
              <>
                <Form.Floating>
                  <Form.Control
                    name="questionContent"
                    id="floatingInput"
                    type="text"
                    placeholder={`請在這裡輸入問題${String.fromCharCode(
                      65 + index
                    )}`}
                    value={info.questionContent}
                    onChange={(e) => {
                      handleGetQuestionContent(index, e);
                    }}
                  />
                  <label htmlFor="floatingInput">{`請輸入問題${
                    index + 1
                  }`}</label>
                </Form.Floating>
                <FloatingLabel
                  controlId="floatingSelectGrid"
                  label="請選擇問答題目數"
                >
                  <Form.Select
                    aria-label="Floating label select example"
                    value={info.numofOptions}
                    onChange={(e) => {
                      handleOptionChange(index, e);
                    }}
                  >
                    <option value="0">請點擊開啟選單</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </Form.Select>
                </FloatingLabel>
              </>
            </InputGroup>
            {/* 以下是動態答案控制欄位 */}
            {info.answerContent.map((answerContent, answerContentIndex) => (
              <InputGroup
                key={`${index}-${answerContentIndex}`}
                className="mt-3"
              >
                <InputGroup.Checkbox
                  aria-label="若此為該問題答案請點選○"
                  checked={answerContent[0]}
                  onChange={(e) => {
                    handleIsCorrectOption(index, answerContentIndex);
                  }}
                />
                <Form.Floating>
                  <Form.Control
                    id="floatingInput"
                    type="text"
                    placeholder={`請在這裡輸入答案${String.fromCharCode(
                      65 + answerContentIndex
                    )}`}
                    value={answerContent[1]}
                    onChange={(e) => {
                      handleAnswerChange(index, answerContentIndex, e);
                    }}
                  />
                  <label htmlFor="floatingInput">{`請輸入答案${String.fromCharCode(
                    65 + answerContentIndex
                  )}`}</label>
                </Form.Floating>
              </InputGroup>
            ))}
          </Card.Body>
        </Card>
      ))}
    </>
  );
}
