import React from "react";
import {
  Card,
  CloseButton,
  Form,
  InputGroup,
  FloatingLabel,
  Row,
  Col,
  Image,
  Container,
  Modal,
} from "react-bootstrap";
import styles from "../../../styles/Form/FormStyles.module.scss";
import { useState } from "react";

export default function BasicDynamicQuestionAndAnswer({
  VideoQA,
  handleDelQAMessage,
  handleGetQuestionPointChange,
  handleGetQuestionImage,
  handleGetQuestionContent,
  handleOptionChange,
  handleIsCorrectOption,
  handleAnswerChange,
}) {
  const [imagePreview, setImagePreview] = useState(null);

  if (!VideoQA) return null;
  // 計算當前有幾個問題/警告訊息需要被填寫
  const totalInfo = VideoQA.length;

  return (
    <>
      {VideoQA.map((info, index) => (
        <Card
          key={`Card${index}`}
          style={{ position: "relative" }}
          className="mb-2"
        >
          {totalInfo > 1 && (
            <CloseButton
              className={`${styles.deleteQAMessage}`}
              onClick={() => {
                handleDelQAMessage(index);
              }}
            />
          )}
          <Card.Title
            key={`option_question${index}`}
            className="pt-3 ps-3 pe-3 pb-0"
          >
            <h3>問題 {index + 1}</h3>
            <p className={`${styles.noticficationMessage}`}>
              <strong>若此為該問題答案請點選○</strong>
            </p>
          </Card.Title>
          <Card.Body key={`cardBody${index}`}>
            {/* In this inputGroup is about Question and Answer Select */}
            <InputGroup key={`optionPoint${index}`} className="mb-3">
              <InputGroup.Text>分數比重</InputGroup.Text>
              <Form.Control
                type="number"
                aria-describedby="inputPoint"
                value={info.questionPoint}
                step="0.1"
                min={1}
                max={100}
                onChange={(e) => {
                  handleGetQuestionPointChange(index, e);
                }}
              />
            </InputGroup>
            <InputGroup key={`questionBlock${index}`}>
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
              <>
                <InputGroup
                  key={`${index}answerGroup-${answerContentIndex}`}
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
                      key={`${index}option_${String.fromCharCode(
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
                <Form.Group
                  key={`${index}option${String.fromCharCode(
                    65 + answerContentIndex
                  )}_image`}
                  controlId="formFileMultiple"
                  className="mt-3 mb-3"
                >
                  <Form.Label>請在這裡點選欲上傳之圖片</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => {
                      handleGetQuestionImage(index, answerContentIndex, e);
                    }}
                    accept="image/*"
                  />
                </Form.Group>
                {info.answerFile[answerContentIndex] !== null && (
                  <Container>
                    <Row>
                      <Col
                        xs={4}
                        md={4}
                        lg={4}
                        key={`${index}option_${answerContentIndex}_image`}
                      >
                        <Image
                          src={
                            info.answerFile &&
                            info.answerFile[answerContentIndex]
                              ? typeof info.answerFile[answerContentIndex] ===
                                  "string" &&
                                info.answerFile[answerContentIndex].startsWith(
                                  "http"
                                )
                                ? info.answerFile[answerContentIndex]
                                : URL.createObjectURL(
                                    info.answerFile[answerContentIndex]
                                  )
                              : null
                          }
                          alt={`optionImage${answerContentIndex}`}
                          rounded
                          style={{ width: "100px", cursor: "pointer" }}
                          onClick={() => {
                            setImagePreview(
                              URL.createObjectURL(
                                info.answerFile[answerContentIndex]
                              )
                            );
                          }}
                        />
                      </Col>
                    </Row>
                  </Container>
                )}
              </>
            ))}
          </Card.Body>
        </Card>
      ))}
      <Modal show={imagePreview} onHide={() => setImagePreview(null)}>
        <Modal.Header closeButton>
          <Modal.Title>圖片預覽</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image
            src={imagePreview}
            alt="..."
            rounded
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
