import React, { useState } from "react";
import {
  Card,
  CloseButton,
  Form,
  InputGroup,
  FloatingLabel,
  ButtonGroup,
  ToggleButton,
  Container,
  Row,
} from "react-bootstrap";
import BtnBootstrap from "../../../components/BtnBootstrap";
import styles from "../../../styles/Form/FormStyles.module.scss";

function DynamicQuestionandAnswer({
  FormMode = false,
  VideoQA,
  handleDelQAMessage,
  handleGetVideoTime,
  handleGetVideoDuration,
  handleCheckMessageType,
  handleGetQuestionMustCorrect,
  handleGetQuestionContent,
  handleOptionChange,
  handleIsCorrectOption,
  handleAnswerChange,
}) {
  if (!VideoQA) return null;

  const [radioValue, setRadioValue] = useState([]);
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
            {/* Get Current Video Question Time */}
            <InputGroup className="mb-2">
              {/* Btn Get Current Time */}
              <BtnBootstrap
                btnID={"button-addon1"}
                onClickEventName={(e) => handleGetVideoTime(index, e)}
                text={"取得當前時間"}
                variant="secondary"
              />

              {/* After get current Time of the Video frame show in the cintrol box */}
              <Form.Control
                name="currentTime"
                placeholder="請點選左方按鍵取得影片當前時間"
                aria-label="Example text with button addon"
                aria-describedby="basic-addon1"
                value={info.currentTime}
                disabled
              />
              <InputGroup.Text>秒</InputGroup.Text>
            </InputGroup>
            {/* 取得問題持續時間 */}
            <InputGroup className="mb-3">
              <Form.Control
                // only can input number
                type="number"
                placeholder="請輸入問題持續時間"
                aria-label="請輸入問題持續時間"
                aria-describedby="basic-addon2"
                value={info.durationTime}
                onChange={(e) => {
                  handleGetVideoDuration(index, e);
                }}
                size="lg"
              />
              <InputGroup.Text id="basic-addon2">秒</InputGroup.Text>
            </InputGroup>

            {/* In this inputGroup is about Question and Answer Select */}
            <InputGroup className="">
              {/* 若是練習用則無必對問題 */}
              {FormMode && (
                <Form.Check // prettier-ignore
                  type={`checkbox`}
                  id={`default-checkbox`}
                  className="mb-2"
                  checked={info.mustCorrectQuestion}
                  label={`若此為必對問題請點選`}
                  onChange={() => {
                    handleGetQuestionMustCorrect(index);
                  }}
                />
              )}
              <Container>
                <Row>
                  {FormMode === false && (
                    <ButtonGroup className="mb-3">
                      <ToggleButton
                        key={"alert"}
                        id={`radio-alert-${index}`}
                        type="radio"
                        variant={0 % 2 ? "outline-success" : "outline-danger"}
                        name={`radio-${index}`}
                        value="0"
                        checked={info.messageType === 0}
                        onChange={(e) => handleCheckMessageType(index, e)}
                      >
                        警示訊息
                      </ToggleButton>
                      <ToggleButton
                        key={"question"}
                        id={`radio-question-${index}`}
                        type="radio"
                        variant={1 % 2 ? "outline-success" : "outline-primary"}
                        name={`radio-${index}`}
                        value="1"
                        checked={info.messageType === 1}
                        onChange={(e) => handleCheckMessageType(index, e)}
                      >
                        問題
                      </ToggleButton>
                    </ButtonGroup>
                  )}
                </Row>
              </Container>

              {info.messageType === 0 && FormMode === false ? (
                <Container>
                  <Row>
                    <Form.Group className="mb-3" controlId="formNewManageMail">
                      <Form.Label>請輸入第{index + 1}個提示訊息：</Form.Label>
                      <Form.Control
                        autoComplete="nope"
                        type="text"
                        name="text"
                        placeholder={`請於此輸入第${index + 1}個提示訊息`}
                        onChange={(e) => {
                          handleGetQuestionContent(index, e);
                        }}
                        value={info.questionContent}
                      />
                    </Form.Group>
                  </Row>
                </Container>
              ) : (
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
              )}
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

export default DynamicQuestionandAnswer;
