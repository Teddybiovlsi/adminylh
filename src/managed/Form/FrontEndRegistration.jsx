// 建立用戶端使用者元件
// 包含email認證/密碼驗證
// 送出用戶資料到API
// 顯示成功訊息/錯誤訊息
// 若傳送成功，5秒後自動跳轉回到首頁

import React, { useEffect, useState } from "react";
import { Form, Modal, ModalFooter, Table } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import Card from "react-bootstrap/Card";
import PageTitle from "../../components/Title";
import BtnBootstrap from "../../components/BtnBootstrap";
import useBoolean from "./shared/useBoolean";
import FormEmail from "./shared/FormEmail";
import FormPwd from "./shared/FormPwd";
import AlertBootstrap from "../../components/AlertBootstrap";
import zxcvbn from "zxcvbn";
import { post } from "../axios";
import { useLocation, useNavigate } from "react-router-dom";
import StatusCode from "../../sys/StatusCode";
import PageTitleHeading from "../../components/PageTitleHeading";
import styles from "../../styles/Form/ClientRegistration.module.scss";

export default function FrontEndRegistration() {
  const location = useLocation();
  const [isCheckAllVideo, setIsCheckAllVideo] = useState(false);
  const [videoIndex, setVideoIndex] = useState(location.state?.videoIndex);
  const [videoName, setVideoName] = useState(location.state?.videoName);
  const [videoData, setVideoData] = useState(location.state?.videoData);
  const [videoTempIndex, setVideoTempIndex] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (videoData.length === videoIndex.length) {
      setIsCheckAllVideo(true);
    }
  }, [videoData, videoIndex]);

  // 單一勾選影片
  const handleSelectVideoindex = (ID) => {
    // if selectVideoindex includes ID, set selectVideoindex to selectVideoindex filter ID
    // otherwise, set selectVideoindex to selectVideoindex add ID
    setVideoIndex(
      setVideoIndex.includes(ID)
        ? setVideoIndex.filter((item) => item !== ID)
        : [...videoIndex, ID]
    );
  };
  // 全部勾選影片
  const handleSelectAllVideo = () => {
    // set isCheckAllVideo to !isCheckAllVideo
    setIsCheckAllVideo(!isCheckAllVideo);
    // if isCheckAllVideo is true, set selectVideoindex to []
    // otherwise, set selectVideoindex to all video ID

    isCheckAllVideo
      ? setVideoIndex([])
      : setVideoIndex(videoData.map((item) => item.id));
  };

  const handleEditVideo = () => {};
  //

  const [step, setStep] = useState(0);
  const [isFirstPage, setIsFirstPage] = useState(false);
  const [isSubmitPage, setIsSubmitPage] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const prevStep = () => setStep(step - 1);
  const nextStep = () => setStep(step + 1);
  useEffect(() => {
    if (step === 0) {
      setIsFirstPage(true);
    } else {
      setIsFirstPage(false);
    }
    if (step === 1) {
      setIsSubmitPage(true);
    } else {
      setIsSubmitPage(false);
    }

    if (step === 2) {
      setIsLastPage(true);
    } else {
      setIsLastPage(false);
    }
  }, [step]);

  const ShowClientVideoTable = ({ id, name }) => {
    return (
      <tr key={id}>
        <td>{name}</td>
      </tr>
    );
  };

  const renderPageRegister = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <p>第{step + 1}步</p>
            <h5 className="mb-2">
              請確認勾選影片是否正確，<b>若有誤請按下"+"進行修正</b>
            </h5>
            <h5>
              若影片無誤請按下一步，<b>進行創建帳號</b>
            </h5>

            <Table>
              <thead>
                <tr>
                  <th>影片名稱</th>
                </tr>
              </thead>
              <tbody>
                {videoName.map((info, index) => {
                  return <ShowClientVideoTable name={info} key={index} />;
                })}
              </tbody>
            </Table>
          </div>
        );
      case 1:
        return <p>第{step + 1}步</p>;
      case 2:
        return <p>第{step + 1}步</p>;
      default:
        return null;
    }
  };

  return (
    <>
      <PageTitle title="台大分院雲林分院｜創建使用者" />
      <div className={styles.client_container}>
        <PageTitleHeading text="創建使用者" styleOptions={3} />
        {renderPageRegister()}
        <div className={styles.footerBtn}>
          {isFirstPage !== true && (
            <BtnBootstrap
              btnPosition="me-auto"
              variant="secondary"
              onClickEventName={prevStep}
              text="上一步"
            />
          )}
          {isFirstPage == true && (
            <BtnBootstrap
              btnPosition="me-auto"
              variant="success"
              onClickEventName={handleShow}
              text="+"
            />
          )}

          <BtnBootstrap
            variant="primary"
            onClickEventName={isLastPage ? handleClose : nextStep}
            text={isLastPage ? "送出" : "下一步"}
          />
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>請選擇要新增的影片</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table table-striped">
            <thead>
              <tr>
                <th
                  className={
                    styles.container_division_table_rowTable_headingCheckBox
                  }
                >
                  <input
                    type="checkbox"
                    onChange={() => {
                      handleSelectAllVideo();
                    }}
                    checked={isCheckAllVideo}
                  />
                </th>
                <th>類型</th>
                <th>語言</th>
                <th>名稱</th>
              </tr>
            </thead>
            <tbody>
              {videoData.map((info, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        value={info.id}
                        checked={videoIndex.includes(info.id)}
                        // onChange={() => {
                        //   handleSelectVideo(info.id);
                        // }}
                        // checked={isCheckVideo[index]}
                        // className={
                        //   styles.container_division_table_rowTable_heading_checkbox
                        // }
                      />
                    </td>
                    <td>{info.video_class}</td>
                    <td>{info.video_language}</td>
                    <td>{info.video_name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <BtnBootstrap
            btnPosition="me-auto"
            variant="secondary"
            onClickEventName={handleClose}
            text="取消"
          />
          <BtnBootstrap
            variant="danger"
            onClickEventName={handleEditVideo}
            text="修改"
          />
        </Modal.Footer>
      </Modal>
    </>
  );
}
