import React, { useRef } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Stack,
} from "react-bootstrap";
import BtnBootstrap from "../../../components/BtnBootstrap";

export default function InputVideoScreenShot({
  // 輸入影片問題的相關變數
  FormMode = false,
  VideoSrc = "",
  ThumbnailSrc = "",
  ThumbnailChangeEvent = null,
  ChangeEvent = null,
  ResetEvent = null,
  // 表單模式和下一步事件的相關變數
  GoPrevEvent = null,
  GoNextEvent = null,
}) {
  // 影片時間參考欄位
  const videoRef = useRef(null);

  const canvasRef = useRef(null);

  const captureFrame = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const thumbnail = canvas.toDataURL("image/png");

    // setVideoThumbnail(thumbnail);
    ThumbnailChangeEvent(thumbnail);
  };

  return (
    <Container>
      <Row className="mb-2">
        <Col className="d-flex justify-content-center" sm={12} md={12} lg={6}>
          <Card>
            <Card.Header>原始影片</Card.Header>
            <Card.Body>
              <video ref={videoRef} src={VideoSrc} width={"100%"} controls />
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Stack gap={2}>
            <div>
              <h4>
                <strong>{`請選擇或匯入衛教${
                  FormMode ? "測驗用" : "練習用"
                }影片縮圖`}</strong>
              </h4>
              <p className="m-0 text-primary">
                可不選擇，若不選擇則無對應縮圖顯示
              </p>
            </div>
            <Form.Control
              accept="image/*"
              name="imageFileInput"
              onChange={ChangeEvent}
              type="file"
            />

            <Card>
              {ThumbnailSrc && (
                <>
                  <Card.Title as={"h5"}>縮圖預覽</Card.Title>
                  <Card.Img src={ThumbnailSrc} />
                </>
              )}

              <Card.Footer>
                <Stack gap={2}>
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  <Button onClick={captureFrame} variant="outline-primary">
                    透過左方影片取得縮圖
                  </Button>
                  <Button onClick={ResetEvent} variant="outline-danger">
                    重置
                  </Button>
                </Stack>
              </Card.Footer>
            </Card>
          </Stack>
        </Col>
      </Row>
      <Stack gap={2}>
        <BtnBootstrap
          text="上一步"
          variant="outline-danger"
          btnSize="md"
          onClickEventName={GoPrevEvent}
        />
        <BtnBootstrap
          text="下一步"
          variant="outline-primary"
          btnSize="md"
          onClickEventName={GoNextEvent}
        />
      </Stack>
    </Container>
  );
}
