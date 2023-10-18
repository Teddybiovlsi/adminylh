import React from "react";
import { Form, Container, Row } from "react-bootstrap";
import BtnBootstrap from "../../../components/BtnBootstrap";
import styles from "../../../styles/Form/FormStyles.module.scss";

function InputVideoFileFunction({
  // 輸入影片文件的相關變數
  VidoeName = "",
  ChangeEvent = null,

  // 表單模式和下一步事件的相關變數
  FormMode = false,
  GoNextEvent = null,
}) {
  const title = `請匯入衛教${FormMode ? "測驗用" : "練習用"}影片`;

  return (
    <Container>
      <Row>
        <Form.Group controlId="formFile">
          <Form.Label>
            <h2>
              <strong>{title}</strong>
            </h2>
          </Form.Label>

          <Form.Control
            accept="video/*"
            name="videoFileInput"
            onChange={ChangeEvent}
            type="file"
          />
          <Form.Label className={`mt-3 ${styles.ExamVideoFileNameContainer}`}>
            <h5>
              {VidoeName && (
                <strong>
                  目前檔案為：
                  <br /> {VidoeName}
                </strong>
              )}
            </h5>
          </Form.Label>
        </Form.Group>
      </Row>
      <Row>
        <BtnBootstrap
          btnName="formStep"
          variant="outline-primary"
          btnSize="btn-md"
          text={"下一步"}
          onClickEventName={GoNextEvent}
          disabled={!VidoeName}
        />
      </Row>
    </Container>
  );
}

export default InputVideoFileFunction;
