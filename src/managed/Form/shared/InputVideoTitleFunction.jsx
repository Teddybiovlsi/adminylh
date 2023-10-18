import React from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import BtnBootstrap from "../../../components/BtnBootstrap";

export default function InputVideoTitleFunction({
  FormMode = false,
  ChangeEvent = null,
  VideoTitle = "",
  GoPrevEvent = null,
  GoNextEvent = null,
}) {
  const VideoTitleAlertMessage = `請點選衛教${
    FormMode ? "測驗用" : "練習用"
  }影片標題名稱`;

  return (
    <Container>
      <Row>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>
            <h2>
              <strong>{VideoTitleAlertMessage}</strong>
            </h2>
            <p>(可選填，若沒填寫則會以影片檔名為標題)</p>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="請在這裡輸入檔案名稱"
            onChange={ChangeEvent}
            defaultValue={VideoTitle}
          />
        </Form.Group>
      </Row>
      <Row>
        <Col>
          <BtnBootstrap
            btnName="formStep"
            btnPosition=""
            btnSize="btn-md"
            onClickEventName={GoPrevEvent}
            text={"上一步"}
            variant="outline-danger"
          />
          <BtnBootstrap
            btnName="formStep"
            btnSize="btn-md"
            btnPosition="float-end"
            onClickEventName={GoNextEvent}
            variant="outline-primary"
            text={"下一步"}
          />
        </Col>
      </Row>
    </Container>
  );
}
