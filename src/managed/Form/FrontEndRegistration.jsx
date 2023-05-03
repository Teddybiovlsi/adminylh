// 建立用戶端使用者元件
// 包含email認證/密碼驗證
// 送出用戶資料到API
// 顯示成功訊息/錯誤訊息
// 若傳送成功，5秒後自動跳轉回到首頁

import React, { useEffect, useState } from "react";
import {
  Form,
  Modal,
  ModalFooter,
  Table,
  FloatingLabel,
} from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import Card from "react-bootstrap/Card";
import PageTitle from "../../components/Title";
import BtnBootstrap from "../../components/BtnBootstrap";
import useBoolean from "./shared/useBoolean";
import FormEmail from "./shared/FormEmail";
import FormPwd from "./shared/FormPwd";
import zxcvbn from "zxcvbn";
import { post } from "../axios";
import { useLocation, useNavigate } from "react-router-dom";
import StatusCode from "../../sys/StatusCode";
import PageTitleHeading from "../../components/PageTitleHeading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastAlert from "../../components/ToastAlert";
import FormIdentity from "./shared/FormIdentity";
import { Stepper, Step } from "react-form-stepper";
import styles from "../../styles/Form/ClientRegistration.module.scss";

export default function FrontEndRegistration() {
  const location = useLocation();
  const [isCheckAllVideo, setIsCheckAllVideo] = useState(false);
  const [videoIndex, setVideoIndex] = useState(location.state?.videoIndex);
  const [videoTempIndex, setVideoTempIndex] = useState(videoIndex);

  const [videoName, setVideoName] = useState(location.state?.videoName);
  const [videoTempName, setVideoTempName] = useState(videoName);

  const [videoData, setVideoData] = useState(location.state?.videoData);
  // 以下是第一頁的表單內容
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show2, setShow2] = useState(false);
  const handleCloseM2 = () => setShow2(false);
  const handleShowM2 = () => setShow2(true);
  // 限制重複點擊
  const [disabledBtn, setDisabledBtn] = useState(false);

  useEffect(() => {
    if (videoData.length === videoTempIndex.length) {
      setIsCheckAllVideo(true);
    } else {
      setIsCheckAllVideo(false);
    }
  }, [videoData, videoTempIndex]);

  useEffect(() => {
    if (videoTempIndex.length === 0) {
      setVideoTempName([]);
    } else if (videoData.length === videoTempIndex.length) {
      setVideoTempName(videoData.map((item) => item.video_name));
    } else {
      videoTempIndex.map((item) => {
        const found = videoData.find(
          (element) => element.id == item
        ).video_name;

        setVideoTempName(
          videoTempName.includes(found)
            ? videoTempName.filter((item) => item == found)
            : [...videoTempName, found]
        );
      });
    }
  }, [videoTempIndex]);

  // 單一勾選影片
  const handleSelectVideoindex = (ID) => {
    // if selectVideoindex includes ID, set selectVideoindex to selectVideoindex filter ID
    // otherwise, set selectVideoindex to selectVideoindex add ID
    setVideoTempIndex(
      videoTempIndex.includes(ID)
        ? videoTempIndex.filter((item) => item !== ID)
        : [...videoTempIndex, ID]
    );
  };
  // 全部勾選影片
  const handleSelectAllVideo = () => {
    // set isCheckAllVideo to !isCheckAllVideo
    setIsCheckAllVideo(!isCheckAllVideo);
    // if isCheckAllVideo is true, set selectVideoindex to []
    // otherwise, set selectVideoindex to all video ID

    isCheckAllVideo
      ? setVideoTempIndex([])
      : setVideoTempIndex(videoData.map((item) => item.id));
  };
  // 修改影片事件
  const handleEditVideo = () => {
    if (videoTempIndex.length === 0) {
      toast.error("請勾選影片!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setDisabledBtn(true);
      setTimeout(() => {
        setDisabledBtn(false);
      }, 3000);
    } else {
      handleShowM2();
    }
  };
  // 確認修改影片事件
  const handleConfirmEditVideo = () => {
    setVideoIndex(videoTempIndex);
    setVideoName(videoTempName);
    handleClose();
    handleCloseM2();
    toast.success("修改影片成功!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // 以下是第二頁表單內容
  const [pwdScore, setPwdScore] = useState(0);
  const [showPwd, { setShowPwd }] = useBoolean(false);
  const { Formik } = formik;

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("信箱格式錯誤，請重新嘗試")
      .required("請輸入信箱"),
    user_account: yup
      .string()
      .required("請輸入身分證字號")
      .matches(/^[A-Za-z][A-D0-9]\d{8}$/, {
        message: "身分證字號格式錯誤，請重新嘗試",
        excludeEmptyString: true,
      }),
    // user_password: yup.string().required("請輸入密碼"),
  });
  const [userInfo, setUserInfo] = useState({
    email: "",
    user_account: "",
    // user_password: "",
  });

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
        return (
          <div>
            <p>第{step + 1}步</p>
            <Formik
              initialValues={{
                email: userInfo.email,
                user_account: "",
                // user_password: "",
              }}
              validationSchema={schema}
              onSubmit={(values) => {
                // console.log(values);
                setUserInfo(values);
                nextStep();
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <FormEmail
                    ChangeEvent={handleChange}
                    BlurEvent={handleBlur}
                    EmailValue={values.email ? values.email : userInfo.email}
                    ValidCheck={touched.email && !errors.email}
                    InValidCheck={touched.email && errors.email}
                    ErrorMessage={errors.email}
                    LabelMessage="請輸入您的信箱(必填)"
                  />
                  <FormIdentity
                    ControlName="user_account"
                    ChangeEvent={handleChange}
                    BlurEvent={handleBlur}
                    TextValue={values.user_account}
                    IdentityValue={values.user_account}
                    ValidCheck={touched.user_account && !errors.user_account}
                    InValidCheck={touched.user_account && errors.user_account}
                    ErrorMessage={errors.user_account}
                  />
                  {/* <FormPwd
                    GroupClassName="mb-1"
                    SetStrengthMeter={true}
                    StrengthMeterPwdScore={pwdScore}
                    ChangeEvent={handleChange}
                    BlurEvent={handleBlur}
                    InputEvent={(e) => {
                      setPwdScore(zxcvbn(e.target.value).score);
                    }}
                    PwdValue={values.user_password}
                    ValidCheck={touched.user_password & !errors.user_password}
                    InValidCheck={!!errors.user_password}
                    ControlID={"inputPassword"}
                    IconID={"showPass"}
                    SetShowPwdCondition={setShowPwd}
                    ShowPwdCondition={showPwd}
                    ErrorMessage={errors.user_password}
                  /> */}
                  <BtnBootstrap
                    btnPosition="me-auto"
                    variant="secondary"
                    onClickEventName={prevStep}
                    text="上一步"
                  />
                  <BtnBootstrap
                    text={"下一步"}
                    btnType="submit"
                    variant={"primary"}
                  />
                </Form>
              )}
            </Formik>
          </div>
        );
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
        <Stepper
          activeStep={step}
          connectorStateColors
          connectorStyleConfig={{
            activeColor: "#9441DF",
            completedColor: "#9441DF",
          }}
        >
          <Step label="基本資料確認" />
          <Step label="帳號填寫" />
          <Step label="最終確認" />
        </Stepper>
        {renderPageRegister()}
        <div className={styles.footerBtn}>
          {isFirstPage !== true && isSubmitPage != true && (
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
          {isSubmitPage != true && (
            <BtnBootstrap
              variant="primary"
              onClickEventName={isLastPage ? handleClose : nextStep}
              text={isLastPage ? "送出" : "下一步"}
            />
          )}
        </div>
      </div>

      {/* 影片修改Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>請選擇要修改/新增的影片</Modal.Title>
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
                        checked={videoTempIndex.includes(info.id)}
                        onChange={() => {
                          handleSelectVideoindex(info.id);
                        }}
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
            disabled={disabledBtn}
          />
        </Modal.Footer>
      </Modal>
      {/* 再次確認影片資訊視窗 */}
      <Modal show={show2} onHide={handleCloseM2}>
        <Modal.Header closeButton>
          <Modal.Title>請再次確認要修改的影片</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>
            <b>修改前影片名稱:</b>{" "}
          </h4>
          <ol>
            {videoName.map((info, index) => {
              return <li key={index}>{info}</li>;
            })}
          </ol>
          <h4>
            <b>修改後影片名稱:</b>
          </h4>
          <ol>
            {videoTempName.map((info, index) => {
              return <li key={index}>{info}</li>;
            })}
          </ol>
          {/* {videoTempIndex.map((info, index) => { */}
        </Modal.Body>
        <Modal.Footer>
          <BtnBootstrap
            btnPosition="me-auto"
            variant="secondary"
            onClickEventName={handleCloseM2}
            text="取消"
          />
          <BtnBootstrap
            variant="danger"
            onClickEventName={handleConfirmEditVideo}
            text="確認"
          />
        </Modal.Footer>
      </Modal>
      <ToastAlert />
    </>
  );
}
