import { set } from "lodash";
import React, { useState } from "react";
import { useEffect } from "react";
import { Col, Container, Form, ListGroup, Modal, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { get } from "../axios";
import BtnBootstrap from "../../components/BtnBootstrap";
import FilterPageSize from "../JsonFile/FilterPageContentSize.json";

export default function EditClientVideoID() {
  //   若無任何資訊則返回首頁
  if (!useLocation().state) window.location.href = "/";

  const location = useLocation();
  // 將已勾選的帳號存入checkedAccount當中
  const [checkedAccount, setCheckedAccount] = useState(
    location.state?.ClientAcc
  );
  // 進入此頁時，先將所有帳號資料撈出
  // 在後續篩選出已經勾選的帳號
  const [accountInfo, setAccountInfo] = useState([]);
  // 將篩選後的資料存入filteraccountInfo當中
  const [filteraccountInfo, setFilteraccountInfo] = useState([]);
  //   若伺服器發生錯誤，則顯示錯誤訊息
  const [errorMessage, setErrorMessage] = useState("");

  const [showAccountModal, setShowAccountModal] = useState(false);
  const handleCloseAccountModal = () => setShowAccountModal(false);
  const handleShowAccountModal = () => setShowAccountModal(true);

  const fetchaAccountData = async ({ api }) => {
    try {
      const response = await get(api);
      // get data from res.data.data
      // because res.data.data is a promise
      // so we need to use await to get the value of res.data.data
      // and then we can use data to get the value of res.data.data
      const data = await response.data.data;
      // check if data is an array
      // if data is an array, checkIsArray is true
      // otherwise, checkIsArray is false
      const checkIsArray = Array.isArray(data);
      // set videoData
      // if checkIsArray is true, set videoData to data
      // otherwise, set videoData to [data]
      setAccountInfo(checkIsArray ? data : [data]);
      // clear error message
      setErrorMessage("");
    } catch (error) {
      // if error.response is true, get error message
      if (error.response) {
        setErrorMessage(StatusCode(error.response.status));
      }
    }
  };
  //   在進入此頁時，先將所有帳號資料進行撈取
  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      fetchaAccountData({
        api: "account",
      });
    }
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    //   將傳過來的資料與已勾選的帳號進行比對
    setFilteraccountInfo(
      accountInfo.filter((item) => {
        return checkedAccount.includes(item.client_unique_id);
      })
    );
  }, [accountInfo]);

  return (
    <div className="container pb-4">
      <h1 className="fw-bold mt-2 mb-2">批次勾選影片</h1>
      <Container>
        <Row>
          <Col>
            <ListGroup as="ol" numbered>
              <h5 className="fw-bold">選擇之帳號：</h5>
              {filteraccountInfo.map((item, index) => {
                return (
                  <ListGroup.Item key={index}>
                    {item.client_unique_id}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
            <BtnBootstrap
              variant="outline-secondary"
              btnPosition="w-100 btn btn-lg"
              text={"增減帳號"}
              onClickEventName={() => {
                handleShowAccountModal();
              }}
            />
          </Col>
          <Col>
            <h5 className="fw-bold">所選擇之影片：</h5>
          </Col>
        </Row>
      </Container>
      <Modal show={showAccountModal} onHide={handleCloseAccountModal}>
        <Modal.Header closeButton>
          <Modal.Title>請選擇新增之帳號</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>搜尋欄</Col>
              <Col>
                <Form.Select
                  aria-label="請選擇每頁資料筆數"
                  // onChange={(e) => {
                >
                  {FilterPageSize.map((item, _) => {
                    return (
                      <option key={item.id} value={item.value}>
                        {item.label}
                      </option>
                    );
                  })}
                </Form.Select>
              </Col>
            </Row>
            <Row>
              <Col>帳號列表</Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <BtnBootstrap
            btnSize="md"
            variant="outline-secondary"
            text={"取消"}
            onClickEventName={() => {
              handleCloseAccountModal();
            }}
          />
          <BtnBootstrap
            btnSize="md"
            variant="outline-primary"
            text={"確認"}

            // onClickEventName={() => {
            // }}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
}
