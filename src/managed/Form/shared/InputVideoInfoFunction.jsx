import React from "react";
import PageTitle from "../../../shared/Title";
import { Form, Card, FloatingLabel } from "react-bootstrap";
import {
  CardTitleFunction,
  CardSecondTitleFunction,
} from "./CardTitleFunction";
import BtnBootstrap from "../../../shared/BtnBootstrap";
import styles from "./scss/FormStyles.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";

function InputVideoInfoFunction({
  FormMode = false,
  ChangeEvent = null,
  VideoLanguage = 0,
  GoPrevEvent = null,
  GoNextEvent = null,
}) {
  return (
    <div className="FormStyle d-flex align-items-center justify-content-center">
      <PageTitle
        title={`台大分院雲林分院｜ ${FormMode ? "測驗用表單" : "練習用表單"}`}
      />
      <Card className={`${styles.ExamVideoInfoCard}`}>
        <Card.Title className={`${styles.FormTitle}`}>
          <CardTitleFunction TitleName={`台大醫院雲林分院`} />
          <CardTitleFunction
            TitleName={`${FormMode ? "測驗用" : "練習用"}表單系統`}
          />
        </Card.Title>
        <Card.Body>
          <Form.Label>
            <CardSecondTitleFunction
              TitleName={`請點選衛教${FormMode ? "測驗用" : "練習用"}影片語言`}
            />
          </Form.Label>
          <FloatingLabel controlId="floatingSelect" label="請選擇影片語言">
            <Form.Select
              name="videoFileLanguage"
              aria-label="Default select example"
              size="lg"
              onChange={ChangeEvent}
              defaultValue={VideoLanguage}
              style={{
                paddingBottom: 0,
              }}
            >
              <option value={""}>請點擊開啟語言選單</option>
              <option value={1}>國語</option>
              <option value={2}>台語</option>
              <option value={3}>英文</option>
              <option value={4}>日文</option>
              <option value={5}>越南文</option>
              <option value={6}>泰文</option>
              <option value={7}>印尼語</option>
              <option value={8}>菲律賓語</option>
            </Form.Select>
          </FloatingLabel>
        </Card.Body>
        <Card.Footer>
          <BtnBootstrap
            btnPosition="ms-2"
            btnName="formStep"
            variant="danger"
            text={"上一步"}
            onClickEventName={GoPrevEvent}
          />
          <BtnBootstrap
            btnPosition="ms-2 float-end"
            btnName="formStep"
            variant="primary"
            text={"下一步"}
            onClickEventName={GoNextEvent}
            disabled={VideoLanguage ? false : true}
          />
        </Card.Footer>
      </Card>
    </div>
  );
}

export default InputVideoInfoFunction;
