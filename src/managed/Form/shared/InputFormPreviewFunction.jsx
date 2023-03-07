import React from "react";
import PageTitle from "../../../shared/Title";
import { Card } from "react-bootstrap";
import { CardTitleFunction } from "./CardTitleFunction";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import SwitchNumToLanguage from "./func/SwitchNumToLanguage";
import styles from "./scss/FormStyles.module.scss";

function InputFormPreviewFunction({
  FormMode = false,
  VideoName = "",
  VideoLanguage = "",
  VideoQA,
  GoPrevEvent = null,
  SubmitEvent = null,
}) {
  return (
    <div className="FormStyle d-flex align-items-center justify-content-center">
      <PageTitle
        title={`台大分院雲林分院｜ ${FormMode ? "測驗用表單" : "練習用表單"}`}
      />
      <Card className={`${styles.PreviewCard}`}>
        <Card.Title className={`${styles.FormTitle}`}>
          <CardTitleFunction TitleName={`台大醫院雲林分院`} />
          <CardTitleFunction
            TitleName={`${FormMode ? "測驗用" : "練習用"}表單系統`}
          />
        </Card.Title>
        <Card.Body>
          <Card.Title>影片名稱:</Card.Title>
          <Card.Text>{VideoName}</Card.Text>
          <Card.Title>影片語言:</Card.Title>
          <Card.Text>{SwitchNumToLanguage(parseInt(VideoLanguage))}</Card.Text>
          {VideoQA?.map((questionInfo, questionIndex) => (
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
                    <Card.Text className="ms-4">{`${answerContent[1]}-答案為${
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
            onClickEventName={GoPrevEvent}
            variant={"danger"}
          />
        </Card.Footer>
      </Card>
    </div>
  );
}

export default InputFormPreviewFunction;
