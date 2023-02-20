import React from "react";
import { Card, Form } from "react-bootstrap";
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
  return (
    <div className="FormStyle d-flex align-items-center justify-content-center">
      <PageTitle title="台大分院雲林分院｜測驗用表單" />
      <Card
        className={`${styles.ExamQusetionCard}`}
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <Card.Title className={styles.FormTitle} style={{ margin: 0 }}>
          <CardTitleFunction
            TitleName={`台大醫院雲林分院 ${
              FormMode ? "測驗用" : "練習用"
            }表單系統`}
          />
        </Card.Title>

        <Card.Body>
          <video
            src={VideoFile}
            className="VideoInput"
            width="100%"
            height={VideoHeight}
            controls
          />

          
        </Card.Body>
      </Card>
    </div>
  );
}

export default InputVideoQAFunction;
