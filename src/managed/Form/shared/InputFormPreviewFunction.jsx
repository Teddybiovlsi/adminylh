import React from "react";
import PageTitle from "../../../shared/Title";
import { Form, Card } from "react-bootstrap";
import CardTitleFunction from "./CardTitleFunction";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import SwitchNumToLanguage from "./func/switchNumToLanguage";
import styles from "./scss/FormStyles.module.scss";

const SwitchLanguage = (languageNum) => {
  switch (languageNum) {
    case 1:
      return "國語";
    case 2:
      return "台語";
    case 3:
      return "英文";
    case 4:
      return "英文";
    case 5:
      return "越南文";
    case 6:
      return "泰文";
    case 7:
      return "印尼語";
    case 8:
      return "菲律賓語";
    default:
      return "";
  }
};

function InputFormPreviewFunction({
  FormMode = false,
  VideoName = "",
  VideoLanguage = "",
  VideoQA,
  GoPrevEvent = null,
  GoNextEvent = null,
}) {
  // 將製作的元件庫 button實例化
  const btn = new BtnBootstrap();
  return (
    <div className="FormStyle d-flex align-items-center justify-content-center">
      <PageTitle
        title={`台大分院雲林分院｜ ${FormMode ? "測驗用表單" : "練習用表單"}`}
      />
      <Card className={`${styles.ExamCard}`}>
        <Card.Title className={`${styles.FormTitle}`}>
          <CardTitleFunction
            TitleName={`台大醫院雲林分院 ${
              FormMode ? "測驗用" : "練習用"
            }表單系統`}
          />
        </Card.Title>
        <Card.Body>
          <Card.Title>影片名稱:</Card.Title>
          <Card.Text>{VideoName}</Card.Text>
          <Card.Title>影片語言:</Card.Title>
          <Card.Text>{SwitchLanguage(parseInt(VideoLanguage))}</Card.Text>
          {VideoQA.map((questionInfo, questionIndex) => (
            <>
              <Card.Title>問題 {questionIndex + 1}:</Card.Title>
              <Card.Title>中斷時間:</Card.Title>
              <Card.Text>{questionInfo.currentTime}</Card.Text>
              <Card.Title>問題內容:</Card.Title>
              <Card.Text>{questionInfo.questionContent}</Card.Text>
              <Card.Title>是否為必定答對問題?</Card.Title>
              <Card.Text>
                {questionInfo.mustCorrectQuestion ? "是" : "否"}
              </Card.Text>
              <Card.Title>答案選項:</Card.Title>
            </>
          ))}
        </Card.Body>
        <Card.Footer>
          <btn.PrimaryBtn
            btnName={"formStep"}
            text={"送出表單"}
            onClickEventName={GoNextEvent}
          />
          <btn.Danger
            btnName={"formStep"}
            text={"上一步"}
            onClickEventName={GoPrevEvent}
          />
        </Card.Footer>
      </Card>
    </div>
  );
}

export default InputFormPreviewFunction;
