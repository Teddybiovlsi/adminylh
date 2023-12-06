import React, { useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Stack,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import BtnBootstrap from "../../components/BtnBootStrap";
import { put } from "../axios";
import ToastAlert from "../../components/ToastAlert";
import { toast } from "react-toastify";

export default function EditVideoThumbnail() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    navigate("/Home", { replace: true });
  }
  // 處理loaction.state傳遞過來的資料
  const { videoUUID, videoUrl, videoType } = location.state;

  const [imageFile, setImageFile] = useState({
    imageFile: "",
    imageFileName: "",
    imageSource: "",
  });

  const [disabledSubmitBtn, setDisabledSubmitBtn] = useState(false);

  // 影片時間參考欄位
  const videoRef = useRef(null);
  // 縮圖參考欄位
  const canvasRef = useRef(null);
  /**
   *
   * @param {*} file 檔案
   * @param {*} name 檔案名稱
   * @param {*} source 檔案來源
   */
  const setImageFileData = (file, name, source) => {
    setImageFile({
      ...imageFile,
      imageFile: file,
      imageFileName: name,
      imageSource: source,
    });
  };
  /**
   * 透過影片取得縮圖
   */
  const captureFrame = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    const context = canvas.getContext("2d");

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const thumbnail = canvas.toDataURL("image/png");

    setImageFileData(null, null, thumbnail);
  };
  /**
   * 處理自定義圖片上傳
   * @param {*} e  event事件處理
   *
   */
  const handleImageFileIsUpload = (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        let base64 = reader.result;
        if (!base64.startsWith("data:image/png;base64,")) {
          base64 = "data:image/png;base64," + base64.split(",")[1];
        }
        setImageFileData(file, file.name, base64);
      };
      reader.readAsDataURL(file);
    }
  };
  /**
   * 重置縮圖
   */
  const handleImageFileIsRemove = () => {
    setImageFileData("", "", "");
  };
  /**
   * 透過API更新影片縮圖
   */
  const fetchUpdateVideoThumbnail = async () => {
    const data = {
      imageSrc: imageFile.imageSource,
    };
    setDisabledSubmitBtn(true);
    try {
      const response = await put(`video/${videoUUID}/thumbnail`, data);
      toast.success("更新縮圖成功", {
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
                src={videoUrl}
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
                <strong>{`請選擇或匯入衛教${
                  videoType ? "測驗用" : "練習用"
                }影片縮圖`}</strong>
              </h4>
              <p className="m-0 text-primary">
                可不選擇，若不選擇則無對應縮圖顯示
              </p>
            </div>
            <Form.Control
              accept="image/*"
              name="imageFileInput"
              onChange={handleImageFileIsUpload}
              type="file"
            />

            <Card>
              {imageFile.imageSource && (
                <>
                  <Card.Title as={"h5"}>縮圖預覽</Card.Title>
                  <Card.Img src={imageFile.imageSource} />
                </>
              )}

              <Card.Footer>
                <Stack gap={2}>
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  <Button onClick={captureFrame} variant="outline-primary">
                    透過左方影片取得縮圖
                  </Button>
                  <Button
                    onClick={handleImageFileIsRemove}
                    variant="outline-danger"
                  >
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
          disabled={imageFile.imageSource === "" || disabledSubmitBtn}
          onClickEventName={fetchUpdateVideoThumbnail}
        />
      </Stack>
      <ToastAlert />
    </Container>
  );
}
