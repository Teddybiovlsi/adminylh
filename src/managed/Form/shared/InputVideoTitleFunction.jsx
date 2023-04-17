import React from "react";
import PageTitle from "../../../components/Title";
import { Form, Card, FloatingLabel } from "react-bootstrap";
import {
  CardTitleFunction,
  CardSecondTitleFunction,
} from "./CardTitleFunction";
import BtnBootstrap from "../../../components/BtnBootstrap";
import styles from "../../../styles/Form/FormStyles.module.scss";

export default function InputVideoTitleFunction({
  FormMode = false,
  ChangeEvent = null,
  VideoTitle = "",
  GoPrevEvent = null,
  GoNextEvent = null,
}) {
  return (
    <div className="FormStyle d-flex align-items-center justify-content-center">
      <Card className={`${styles.ExamTitleCard}`}>
        <Card.Title className={`${styles.FormTitle}`}>
          <CardTitleFunction TitleName={`台大醫院雲林分院`} />
          <CardTitleFunction
            TitleName={`${FormMode ? "測驗用" : "練習用"}表單系統`}
          />
        </Card.Title>
        <Card.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>
              <CardSecondTitleFunction
                TitleName={`請點選衛教${
                  FormMode ? "測驗用" : "練習用"
                }影片標題名稱`}
              />
              <h5>
                <b>(可選填，若沒填寫則會以影片檔名為標題)</b>
              </h5>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="請在這裡輸入檔案名稱"
              onChange={ChangeEvent}
              defaultValue={VideoTitle}
            />
          </Form.Group>
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
          />
        </Card.Footer>
      </Card>
    </div>
  );
}
