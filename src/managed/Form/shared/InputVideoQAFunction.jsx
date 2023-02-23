import React, { useState, useRef } from "react";
import {
  Card,
  Form,
  InputGroup,
  FloatingLabel,
  CloseButton,
  Stack,
} from "react-bootstrap";
import PageTitle from "../../../shared/Title";
import CardTitleFunction from "./CardTitleFunction";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import styles from "./scss/FormStyles.module.scss";

function InputVideoQAFunction({
  FormMode = false,
  VideoFile = "",
  VideoHeight = "500px",
  VideoQA,
  setVideoQA,
}) {
  // 將製作的元件庫 button實例化
  const btn = new BtnBootstrap();

  const [numOptions, setNumOptions] = useState(2);

  // 影片時間參考欄位
  const videoRef = useRef(null);

  // 影片資訊欄位
  const handleOptionChange = (event) => {
    setNumOptions(parseInt(event.target.value));
  };

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
    newVideoQA[index].mustCorrectQuestion = !newVideoQA[index].mustCorrectQuestion;
    setVideoQA(newVideoQA);
  };

  // 增加輸入欄位
  const handleAddQuestion = () => {
    setVideoQA([...VideoQA, { currentTime: 0,  mustCorrectQuestion: false}]);
  };
  
  // 刪減輸入欄位
  const handleDelQAMessage = (index) => {
    const newVideoQA = [...VideoQA];
    newVideoQA.splice(index, 1);
    setVideoQA(newVideoQA);
  };

  // 動態答案生成
  const answerInputs = [];

  for (let i = 0; i < numOptions; i++) {
    const answer = String.fromCharCode(65 + i); // answerNumber為1~4的數字
    answerInputs.push(
      <InputGroup key={i} className="mb-2">
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
            ref={videoRef}
            src={VideoFile}
            className="VideoInput"
            width="100%"
            height="600px"
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
              <btn.Secondary text={"新增問題"} eventName={handleAddQuestion} />
            </div>
          </Stack>

          {VideoQA.map((info, index) => (
            <Card key={index} style={{ position: "relative" }} className="mb-2">
              {index > 0 && (
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
                  <strong>若下列填寫問題為必答問題請點選○</strong>
                </p>
                <p className={`${styles.noticficationMessage}`}>
                  <strong>若此為該問題答案請點選○</strong>
                </p>
              </Card.Title>
              <Card.Body>
                {/* Get Current Video Question Time */}
                <InputGroup className="mb-2">
                  {/* Btn Get Current Time */}
                  <btn.Secondary
                    btnID={"button-addon1"}
                    eventName={(e) => handleGetVideoTime(index, e)}
                    text={"取得當前時間"}
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
                {/* In this inputGroup is about Question and Answer Select */}
                <InputGroup className="pb-2">
                  <InputGroup.Checkbox  
                    aria-label="若此為必對問題請點選"
                    onChange={() => {handleGetQuestionMustCorrect(index)}}
                  />
                  <Form.Floating>
                    <Form.Control
                      name=""
                      id="floatingInput"
                      type="text"
                      placeholder={`請輸入問題${index + 1}`}
                    />
                    <label htmlFor="floatingInput">{`請輸入問題${index + 1}`}</label>
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
                      <option value="0">請點擊開啟選單</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </Form.Select>
                  </FloatingLabel>
                </InputGroup>
              </Card.Body>
            </Card>
          ))}

          {/* <InputGroup className="pb-2">
                  <InputGroup.Radio aria-label="若此為必對問題請點選" />
                  <Form.Floating>
                    <Form.Control
                      name=""
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
                      <option value="0">請點擊開啟選單</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </Form.Select>
                  </FloatingLabel>
                </InputGroup>
                {answerInputs} */}
          {/* </Card.Body>
             </Card>; */}
        </Card.Body>
      </Card>
    </div>
  );
}

export default InputVideoQAFunction;
