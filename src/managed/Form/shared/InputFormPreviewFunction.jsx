import React from "react";
import PageTitle from "../../../shared/Title";
import { Form, Card } from "react-bootstrap";
import CardTitleFunction from "./CardTitleFunction";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import styles from "./scss/FormStyles.module.scss";
function InputFormPreviewFunction({
  FormMode = false,
  VideoName = "",
  VideoLanguage="",
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
          <Card.Title>影片名稱：</Card.Title>
          <Card.Text>{VideoName}</Card.Text>
          <Card.Title>影片語言：</Card.Title>
          <Card.Text>{VideoLanguage}</Card.Text>

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
