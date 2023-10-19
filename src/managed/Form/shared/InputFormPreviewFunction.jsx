import React from "react";
import PageTitle from "../../../components/Title";
import { Card, Col, Container, Row, Stack } from "react-bootstrap";
import { CardTitleFunction } from "./CardTitleFunction";
import BtnBootstrap from "../../../components/BtnBootstrap";
import {
  SwitchNumToLanguage,
  SwitchNumToType,
} from "./func/SwitchNumToLanguage";
import styles from "../../../styles/Form/FormStyles.module.scss";

function InputFormPreviewFunction({
  FormMode = false,
  VideoName = "",
  VideoTitle = "",
  VideoLanguage = "",
  VideoType = "",
  VideoQA,
  GoPrevEvent = null,
  SubmitEvent = null,
  SubmitEventDisabled = false,
}) {
  return (
    <Container>
      <Row>
        <Col className="h5 ps-0" md={4}>
          影片名稱:
        </Col>
        <Col md={6}>{VideoTitle != "" ? VideoTitle : VideoName}</Col>
      </Row>

      <Row>
        <Col className="h5 ps-0" md={4}>
          影片語言:
        </Col>
        <Col md={6}>{SwitchNumToLanguage(parseInt(VideoLanguage))}</Col>
      </Row>

      <Row>
        <Col className="h5 ps-0" md={4}>
          影片類型:
        </Col>
        <Col md={6}>{SwitchNumToType(parseInt(VideoType))}</Col>
      </Row>

      {VideoQA?.map((questionInfo, questionIndex) => (
        <Card key={questionIndex} className="mb-2">
          <Card.Title className="mb-2 ms-1">
            問題 {questionIndex + 1}:
          </Card.Title>
          <Container>
            <Row>
              <Col className="h5 ps-0" md={4}>
                中斷時間:
              </Col>
              <Col md={6}>{questionInfo.currentTime}秒</Col>
            </Row>

            <Row>
              <Col className="h5 ps-0" md={4}>
                {questionInfo.messageType === 0 ? "提示訊息:" : "問題內容:"}
              </Col>
              <Col md={6}>{questionInfo.questionContent}</Col>
            </Row>
          </Container>

          {FormMode && (
            <>
              <Card.Title className="ms-2">是否為必定答對問題?</Card.Title>
              <Card.Text className="ms-4">
                {questionInfo.mustCorrectQuestion ? "是" : "否"}
              </Card.Text>
            </>
          )}

          {questionInfo.answerContent.map(
            (answerContent, answerContentIndex) => (
              <div key={`${questionIndex}-${answerContentIndex}`}>
                <Card.Title className="ms-2">{`答案${String.fromCharCode(
                  65 + answerContentIndex
                )}:`}</Card.Title>
                <Card.Text className="ms-4">{`${answerContent[1]}-答案為${
                  answerContent[0] ? "正確" : "錯誤"
                }`}</Card.Text>
              </div>
            )
          )}
        </Card>
      ))}

      <Stack gap={2} className="col-md-5 mx-auto">
        <BtnBootstrap
          btnPosition=""
          btnName="formStep"
          btnSize="md"
          disabled={SubmitEventDisabled}
          text={"送出表單"}
          onClickEventName={SubmitEvent}
          variant="outline-primary"
        />
        <BtnBootstrap
          btnPosition=""
          btnName={"formStep"}
          btnSize="md"
          text={"上一步"}
          onClickEventName={GoPrevEvent}
          variant={"outline-danger"}
        />
      </Stack>
    </Container>
  );
}

export default InputFormPreviewFunction;
