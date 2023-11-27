import React from "react";
import PageTitle from "../../../components/Title";
import {
  Form,
  Card,
  FloatingLabel,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import {
  CardTitleFunction,
  CardSecondTitleFunction,
} from "./CardTitleFunction";
import BtnBootstrap from "../../../components/BtnBootStrap";
import styles from "../../../styles/Form/FormStyles.module.scss";

function InputVideoTypeFunction({
  FormMode = false,
  ChangeEvent = null,
  VideoType = 0,
  GoPrevEvent = null,
  GoNextEvent = null,
}) {
  const TypeOptions = [
    { value: 1, label: "疾病照護" },
    { value: 2, label: "活動" },
    { value: 3, label: "進食" },
    { value: 4, label: "管路照護及異常處理" },
    { value: 5, label: "皮膚照護" },
    { value: 6, label: "傷口照護" },
    { value: 7, label: "預防合併症" },
  ];

  return (
    <Container>
      <Row>
        <Form.Label>
          <h2>
            <strong>請點選衛教影片類別</strong>
          </h2>
        </Form.Label>
        <Form.Select
          aria-label="請選擇影片類別"
          defaultValue={VideoType}
          name="videoFileType"
          onChange={ChangeEvent}
          size="lg"
        >
          <option value={""}>請點擊開啟類別選單</option>
          {TypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      </Row>
      <Row className="mt-4">
        <Col>
          <BtnBootstrap
            btnPosition=""
            btnSize="btn-md"
            btnName="formStep"
            variant="outline-danger"
            text={"上一步"}
            onClickEventName={GoPrevEvent}
          />
        </Col>
        <Col>
          <BtnBootstrap
            btnPosition="float-end"
            btnSize="btn-md"
            btnName="formStep"
            variant="outline-primary"
            text={"下一步"}
            onClickEventName={GoNextEvent}
            disabled={VideoType ? false : true}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default InputVideoTypeFunction;
