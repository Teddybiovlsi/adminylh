import React, { useEffect, useState } from "react";
import { Accordion, Container, Row, Col } from "react-bootstrap";
import PageTitle from "../../components/Title";
import PageTitleHeading from "../../components/PageTitleHeading";
import { get } from "../axios";

export default function ManageClientRecord() {
  const convertType = (type) => {
    switch (type) {
      case 0:
        return "練習";
      case 1:
        return "測驗";
      default:
        return "練習";
    }
  };

  const [loading, setLoading] = useState(true);

  const [eachUserRecord, setEachUserRecord] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchaAccountData = async ({ api }) => {
    try {
      const response = await get(api);
      const data = await response.data.data;
      const checkIsArray = Array.isArray(data);

      setEachUserRecord(checkIsArray ? data : [data]);
      // 將 loading 設為 false
      setLoading(false);
      // clear error message
      setErrorMessage("");
    } catch (error) {
      // 將 loading 設為 false
      setLoading(false);
      // if error.response is true, get error message
      if (error.response) {
        setErrorMessage(StatusCode(error.response.status));
      }
    }
  };

  useEffect(() => {
    let ignore = false;
    const fetchClientRecord = () => {
      fetchaAccountData({ api: "Admin/Record" });
    };
    if (!ignore) {
      // set loading to true
      setLoading(true);
      fetchClientRecord();
    }
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <PageTitle title="臺大醫院雲林分院-衛教系統 使用者紀錄管理" />
      <PageTitleHeading text={"紀錄資訊欄位"} styleOptions={3} />
      <Container>
        <Accordion>
          {eachUserRecord.map((user, index) => {
            return (
              <Accordion.Item eventKey={user.name} key={user.name}>
                <Accordion.Header>{user.name}</Accordion.Header>
                <Accordion.Body>
                  {user.have_video === "使用者目前尚未有勾選之影片" ? (
                    <div>使用者目前尚未有勾選之影片</div>
                  ) : (
                    <Accordion>
                      {user.record.map((record, index) => {
                        return (
                          <Accordion.Item
                            eventKey={record.videoName}
                            key={record.videoName}
                          >
                            <Accordion.Header>
                              <p>
                                <b
                                  className={
                                    record.videoType === 1
                                      ? "text-danger"
                                      : "text-primary"
                                  }
                                >
                                  ({convertType(record.videoType)})
                                </b>
                                {record.videoName}
                              </p>
                            </Accordion.Header>
                            <Accordion.Body>
                              {record.record_result ===
                              "使用者目前尚未有任何紀錄" ? (
                                <p className="text-center fs-4 m-0">
                                  {record.videoName}尚未有任何紀錄
                                </p>
                              ) : (
                                <Container>
                                  <Row>
                                    <Col md={6} xs={10}>
                                      總{convertType(record.videoType)}次數：
                                      <b>{record.totalPraticeTimes}</b>
                                    </Col>
                                    <Col md={6} xs={10}>
                                      總{convertType(record.videoType)}準確率：
                                      <b>{record.record_result}%</b>
                                    </Col>
                                  </Row>
                                  {record.totalQuiz.map((quiz, index) => {
                                    return (
                                      <Row key={index} className="mt-2">
                                        <p className="fs-5">
                                          第{index + 1}章節
                                        </p>
                                        <Col md={4} xs={8}>
                                          是否為必答題：
                                          <b className="text-danger">
                                            {quiz.video_must_correct === 1
                                              ? "是"
                                              : "否"}
                                          </b>
                                        </Col>
                                        <Col md={4} xs={8}>
                                          {convertType(record.videoType)}次數：
                                          <b>{quiz.eachQuestionPraticeTimes}</b>
                                        </Col>
                                        <Col md={4} xs={8}>
                                          {convertType(record.videoType)}
                                          準確率：
                                          <b>{quiz.eachQuizAccuracy * 100}%</b>
                                        </Col>
                                      </Row>
                                    );
                                  })}
                                </Container>
                              )}
                            </Accordion.Body>
                          </Accordion.Item>
                        );
                      })}
                    </Accordion>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Container>
    </>
  );
}
