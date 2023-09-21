import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Container, Form, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../axios";
import BtnBootstrap from "../../components/BtnBootstrap";
import ToastAlert from "../../components/ToastAlert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LogIn() {
  const isUserLoggedIn =
    !localStorage.getItem("manage") && !sessionStorage.getItem("manage");
  const [userInfo, setUserInfo] = useState({
    account: "",
    password: "",
    isRemember: false,
  });

  const [tempuser, setTempUser] = useState(null);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [isDisabledLoginButton, setIsDisabledLoginButton] = useState(false);

  const handleSubmit = useCallback(
    (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (form.checkValidity() === true) {
        event.preventDefault();
        fetchaLoginData(userInfo);
      }

      setValidated(true);
    },
    [userInfo]
  );

  const fetchaLoginData = useCallback(async (data) => {
    const clientSubmit = toast.loading("登入中...");
    setIsDisabledLoginButton(true);
    try {
      const response = await post("admin/login", data);

      const userInfo = await response.data;

      setTempUser(userInfo);
      // console.log(userInfo);

      toast.update(clientSubmit, {
        render: "登入成功，3秒後將回到當前頁面",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setTimeout(() => {
        setIsDisabledLoginButton(false);
      }, 3000);
    } catch (error) {
      // console.log(error.response.data);
      if (error.code === "ECONNABORTED") {
        toast.update(clientSubmit, {
          render: "連線逾時，請稍後再試",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(clientSubmit, {
          render: `${error.response.data.message}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
      setTimeout(() => {
        setIsDisabledLoginButton(false);
      }, 3000);
    }
  }, []);

  useEffect(() => {
    if (tempuser !== null) {
      if (userInfo.isRemember) {
        localStorage.setItem("manage", JSON.stringify(tempuser));
        setTimeout(() => {
          navigate("/Home");
        }, 3000);
      } else {
        sessionStorage.setItem("manage", JSON.stringify(tempuser));
        setTimeout(() => {
          navigate("/Home");
        }, 3000);
      }
    }
  }, [tempuser, userInfo.isRemember]);

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate("/Home");
    }
  }, [isUserLoggedIn, navigate]);

  // const clientSubmit = useMemo(() => toast.loading("登入中..."), []);

  return (
    <Container>
      <h1 className="text-center">歡迎光臨台大衛教系統</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Col>
          <Form.Group as={Row} md="4" controlId="validationCustom01">
            <Form.Label>帳號</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="請輸入帳號"
              onChange={(e) => {
                setUserInfo({ ...userInfo, account: e.target.value });
              }}
            />
            <Form.Control.Feedback type="invalid">
              請輸入帳號
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Row} controlId="formPwd">
            <Form.Label>密碼</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="請輸入密碼"
              onChange={(e) => {
                setUserInfo({ ...userInfo, password: e.target.value });
              }}
              isInvalid={ErrorMessage.passwordErrorMessage}
            />
            <Form.Control.Feedback type="invalid">
              請輸入密碼
            </Form.Control.Feedback>
          </Form.Group>
          <Row>
            <Col>
              <Form.Check
                type="checkbox"
                label="記住我"
                className="mt-2"
                id="remember"
                value={userInfo.isRemember}
                onClick={() => {
                  setUserInfo({
                    ...userInfo,
                    isRemember: !userInfo.isRemember,
                  });
                }}
              />
            </Col>
            <Col>
              <BtnBootstrap
                btnPosition="mt-2 float-end"
                btnSize="md"
                variant="primary"
                btnType="submit"
                text="登入"
                disabled={isDisabledLoginButton}
              />
            </Col>
          </Row>
        </Col>
      </Form>
      <ToastAlert />
    </Container>
  );
}
