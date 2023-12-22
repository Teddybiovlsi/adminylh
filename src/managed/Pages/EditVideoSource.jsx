import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Stack,
} from "react-bootstrap";
import { toast } from "react-toastify";

import BtnBootstrap from "../../components/BtnBootstrap";
import ToastAlert from "../../components/ToastAlert";
import { post, put } from "../axios";

export default function EditVideoSource() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    navigate("/Home", { replace: true });
  }
  // 處理loaction.state傳遞過來的資料
  const { videoUUID, videoUrl, videoName } = location.state;

  const [disabledSubmitBtn, setDisabledSubmitBtn] = useState(false);

  const [formType, setFormType] = useState({
    videoFile: null,
    videoFileName: "",
    videoTitleName: "",
    videoSource: "",
    videoDuration: 0,
  });

  // 影片時間參考欄位
  const videoRef = useRef(null);
  // 縮圖參考欄位
  const canvasRef = useRef(null);

  const hadleVideoFileIsUpload = (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = function () {
        const duration = video.duration;
        setFormType({
          ...formType,
          videoFile: e.target.files[0],
          videoFileName: e.target.files[0].name,
          // remove the suffix of the video file name
          videoTitleName: e.target.files[0].name.split(".")[0],
          videoSource: URL.createObjectURL(e.target.files[0]),
          videoDuration: duration,
        });
      };
      video.src = URL.createObjectURL(file);
    }
  };

  /**
   * 透過API更新影片原始檔案、影片名稱
   */
  const fetchUpdateVideoSource = async () => {
    const data = {
      videoFile: formType.videoFile,
      videoDuration: formType.videoDuration,
      videoName: formType.videoTitleName,
    };
    console.log(data.videoFile);
    setDisabledSubmitBtn(true);
    try {
      const response = await post(`video/${videoUUID}/videoSource`, data);
      toast.success("更新影片成功", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate("/Home", { replace: true });
      }, 3000);
    } catch (error) {
      console.error(error.response.data);
      setTimeout(() => {
        setDisabledSubmitBtn(false);
      }, 3000);
    }
  };

  return (
    <Container>
      <Row className="mb-2">
        <Col className="d-flex justify-content-center" sm={12} md={12} lg={6}>
          <Card>
            <Card.Header>原始影片</Card.Header>
            <Card.Body>
              <video
                crossOrigin="anonymous"
                ref={videoRef}
                src={formType.videoSource ? formType.videoSource : videoUrl}
                width={"100%"}
                controls
              />
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Stack gap={2}>
            <div>
              <h4>
                <strong>請匯入欲更新之衛教影片</strong>
              </h4>
              <p className="m-0 text-primary">
                可不選擇，若不選擇則無對應縮圖顯示
              </p>
            </div>
            <Form.Group controlId="formFile">
              <Form.Control
                accept="video/*"
                name="videoFileInput"
                onChange={hadleVideoFileIsUpload}
                type="file"
              />
            </Form.Group>
            <Form.Group controlId="formVideoName">
              <Form.Label>影片名稱</Form.Label>
              <Form.Control
                type="text"
                placeholder="請輸入影片名稱，若不輸入則使用原始影片名稱"
                value={formType.videoTitleName ? formType.videoTitleName : null}
                onChange={(e) => {
                  setFormType({
                    ...formType,
                    videoTitleName: e.target.value,
                  });
                }}
              />
            </Form.Group>
          </Stack>
        </Col>
      </Row>
      <Stack gap={2}>
        <BtnBootstrap
          text="返回"
          variant="outline-secondary"
          btnSize="md"
          onClickEventName={() => {
            navigate("/Home", { replace: true });
          }}
        />
        <BtnBootstrap
          text="送出"
          variant="outline-primary"
          btnSize="md"
          disabled={formType.videoFile === null}
          onClickEventName={fetchUpdateVideoSource}
        />
      </Stack>
      <ToastAlert />
    </Container>
  );
}
