import React, { useState } from "react";
import { Card, Form, InputGroup, FloatingLabel } from "react-bootstrap";
import PageTitle from "../../../shared/Title";
import CardTitleFunction from "./CardTitleFunction";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import styles from "./scss/FormStyles.module.scss";

function InputVideoQAFunction({
  FormMode = false,
  VideoFile = "",
  VideoHeight = "500px",
}) {
  const btn = new BtnBootstrap();

  const [numOptions, setNumOptions] = useState(2);

  const handleOptionChange = (event) => {
    setNumOptions(parseInt(event.target.value));
  };

  const answerInputs = [];

  for (let i = 0; i < numOptions; i++) {
    const answer = String.fromCharCode(65 + i); // answerNumber為1~4的數字
    answerInputs.push(
      <InputGroup key={i} className="ps-2 pe-2">
        <InputGroup.Radio aria-label="若此為該問題答案請點選○" />
        <Form.Floating>
          <Form.Control
            id="floatingInput"
            type="text"
            placeholder={`請輸入答案 ${answer}`}
          />
          <label htmlFor="floatingInput">{`請輸入答案 ${answer}`}</label>
        </Form.Floating>
      </InputGroup>
      // <div key={i}>
      //   <label>Answer {answer}:</label>
      //   <input type="text" name={`answer-${answer}`} />
      // </div>
    );
  }

  return (
    <div className="FormStyle d-flex align-items-center justify-content-center">
      <PageTitle title="台大分院雲林分院｜測驗用表單" />
      <Card className={`${styles.ExamQusetionCard}`}>
        <Card.Title className={styles.FormTitle} style={{ margin: 0 }}>
          <CardTitleFunction
            TitleName={`台大醫院雲林分院 ${
              FormMode ? "測驗用" : "練習用"
            }表單系統`}
          />
        </Card.Title>

        <Card.Body className="pt-0 ps-0 pe-0">
          <video
            src={VideoFile}
            className="VideoInput"
            width="100%"
            height={VideoHeight}
            controls
          />
          <InputGroup className="ps-2 pe-2">
            <Form.Label>
              <h2>
                <strong>請填寫衛教測驗用影片問題</strong>
              </h2>
              <p>
                <strong>若下列填寫問題為必答問題請點選○</strong>
              </p>
            </Form.Label>
          </InputGroup>
          <InputGroup className="ps-2 pe-2 pb-2">
            <InputGroup.Radio aria-label="若此為必對問題請點選" />
            <Form.Floating>
              <Form.Control
                id="floatingInput"
                type="text"
                placeholder="請輸入問題"
              />
              <label htmlFor="floatingInput">請輸入問題</label>
            </Form.Floating>
            <FloatingLabel
              controlId="floatingSelectGrid"
              label="請選擇問答題目數"
            >
              <Form.Select
                aria-label="Floating label select example"
                value={numOptions}
                onChange={handleOptionChange}
              >
                <option>請點擊開啟選單</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Form.Select>
            </FloatingLabel>
          </InputGroup>
          {answerInputs}
        </Card.Body>
      </Card>
    </div>
  );
}

export default InputVideoQAFunction;
