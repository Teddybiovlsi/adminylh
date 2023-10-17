import React from "react";
import PageTitle from "../../../components/Title";
import { Card, Col, Container, Row } from "react-bootstrap";
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
    <div className="FormStyle d-flex align-items-center justify-content-center">
      <PageTitle
        title={`台大分院雲林分院｜ ${FormMode ? "測驗用表單" : "練習用表單"}`}
      />
      <Card className={`${styles.PreviewCard}`}>
        <Card.Title className={`${styles.FormTitle}`}>
          <CardTitleFunction TitleName={`台大醫院雲林分院`} />
          <CardTitleFunction
            TitleName={`${FormMode ? "測驗用" : "練習用"}表單系統`}
          />
        </Card.Title>
        <Card.Body>
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
          </Container>

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
        </Card.Body>
        <Card.Footer>
          <BtnBootstrap
            disabled={SubmitEventDisabled}
            btnName={"formStep"}
            text={"送出表單"}
            onClickEventName={SubmitEvent}
            variant={"primary"}
          />
          <BtnBootstrap
            btnName={"formStep"}
            text={"上一步"}
            onClickEventName={GoPrevEvent}
            variant={"danger"}
          />
        </Card.Footer>
      </Card>
    </div>
  );
}

export default InputFormPreviewFunction;
