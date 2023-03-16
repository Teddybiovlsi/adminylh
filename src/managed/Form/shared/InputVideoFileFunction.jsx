import React from "react";
import { Form, Card } from "react-bootstrap";
import PageTitle from "../../../shared/Title";
import { CardTitleFunction } from "./CardTitleFunction";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import styles from "../../../styles/Form/FormStyles.module.scss";

function InputVideoFileFunction({
  FormMode = false,
  ChangeEvent = null,
  VidoeName = "",
  GoNextEvent = null,
}) {
  return (
    <>
      <PageTitle
        title={`台大分院雲林分院｜ ${FormMode ? "測驗用表單" : "練習用表單"}`}
      />
      <div className="FormStyle d-flex align-items-center justify-content-center">
        <Card className={`${styles.ExamVideoInputCard}`}>
          <Card.Title className={`${styles.FormTitle}`}>
            <CardTitleFunction TitleName={`台大醫院雲林分院`} />
            <CardTitleFunction
              TitleName={`${FormMode ? "測驗用" : "練習用"}表單系統`}
            />
          </Card.Title>
          <Card.Body>
            <Form.Group controlId="formFile">
              <Form.Label>
                <h2>
                  <strong>
                    請匯入衛教{FormMode ? "測驗用" : "練習用"}影片
                  </strong>
                </h2>
              </Form.Label>

              <Form.Control
                type="file"
                name="videoFileInput"
                accept="video/*"
                onChange={ChangeEvent}
              />
              <Form.Label className={`mt-3 ${styles.ExamVideoFileNameContainer}`}>
                <h5>{VidoeName && <strong>目前檔案為：<br /> {VidoeName}</strong>}</h5>
              </Form.Label>
            </Form.Group>
          </Card.Body>
          <Card.Footer>
            <BtnBootstrap
              btnName="formStep"
              variant="primary"
              text={"下一步"}
              onClickEventName={GoNextEvent}
              disabled={!VidoeName}
            />
          </Card.Footer>
        </Card>
      </div>
    </>
  );
}

export default InputVideoFileFunction;
