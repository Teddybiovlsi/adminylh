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
import BtnBootstrap from "../../../components/BtnBootstrap";
import styles from "../../../styles/Form/FormStyles.module.scss";

function InputVideoLanguageFunction({
  // 選擇影片語言的變數
  VideoLanguage = 0,

  // 表單模式和下一步事件的相關變數
  ChangeEvent = null,
  GoPrevEvent = null,
  GoNextEvent = null,
}) {
  const VideoTitleLanguage = `請點選衛教影片語言`;

  const languageOptions = [
    { value: 1, label: "國語" },
    { value: 2, label: "台語" },
    { value: 3, label: "英文" },
    { value: 4, label: "日文" },
    { value: 5, label: "越南文" },
    { value: 6, label: "泰文" },
    { value: 7, label: "印尼語" },
    { value: 8, label: "菲律賓語" },
  ];

  return (
    <Container>
      <Row>
        <Form.Label>
          <h2>
            <strong>{VideoTitleLanguage}</strong>
          </h2>
        </Form.Label>

        <Form.Select
          aria-label="請選擇影片的語言"
          defaultValue={VideoLanguage}
          name="videoFileLanguage"
          onChange={ChangeEvent}
          size="lg"
        >
          <option value={""}>請點擊開啟語言選單</option>
          {languageOptions.map((option) => (
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
        <Col xs={5}>
          <BtnBootstrap
            btnPosition="float-end"
            btnSize="btn-md"
            btnName="formStep"
            variant="outline-primary"
            text={"下一步"}
            onClickEventName={GoNextEvent}
            disabled={VideoLanguage ? false : true}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default InputVideoLanguageFunction;
