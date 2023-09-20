import limitPage from "../JsonFile/FilterPageContentSize.json";
import React, { useEffect, useState } from "react";
import { Accordion, Container, Row, Col, Form } from "react-bootstrap";
import PageTitle from "../../components/Title";
import PageTitleHeading from "../../components/PageTitleHeading";
import { get } from "../axios";
import ReactPaginate from "react-paginate";

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
  //   原始使用者紀錄資料
  const [eachUserRecord, setEachUserRecord] = useState([]);
  //   slice後的使用者紀錄資料
  const [eachUserRecordSlice, setEachUserRecordSlice] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [paginationSettings, setPaginationSettings] = useState({
    rowsPerPage: 5,
    currentPage: 0,
    lastPage: 1,
  });

  const handlePageChange = (page) => {
    setPaginationSettings({
      ...paginationSettings,
      currentPage: page,
    });
  };

  const fetchaAccountData = async ({ api }) => {
    try {
      const response = await get(api);
      const data = await response.data.data;
      const checkIsArray = Array.isArray(data);

      setEachUserRecord(checkIsArray ? data : [data]);
      setEachUserRecordSlice(checkIsArray ? data : [data]);
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

  useEffect(() => {
    const start =
      paginationSettings.currentPage * paginationSettings.rowsPerPage;
    const end = start + paginationSettings.rowsPerPage;
    setEachUserRecordSlice(eachUserRecord.slice(start, end));
    setPaginationSettings({
      ...paginationSettings,
      lastPage: Math.ceil(
        eachUserRecord.length / paginationSettings.rowsPerPage
      ),
    });
  }, [
    eachUserRecord,
    paginationSettings.currentPage,
    paginationSettings.rowsPerPage,
  ]);

  return (
    <>
      <PageTitle title="臺大醫院雲林分院-衛教系統 使用者紀錄管理" />
      <PageTitleHeading text={"紀錄資訊欄位"} styleOptions={3} />
      <Container>
        <Row>
          <Col md={{ span: 4, offset: 8 }}>
            <Form.Select
              className="mt-1"
              aria-label="請選擇每頁顯示筆數"
              onChange={(event) => {
                setPaginationSettings({
                  ...paginationSettings,
                  currentPage: 0,
                  rowsPerPage: Number(event.target.value),
                });
              }}
              selected={paginationSettings.rowsPerPage}
            >
              {
                // use map to show 每頁顯示筆數
                limitPage.map((limit, _) => {
                  return (
                    <option key={limit.id} value={limit.value}>
                      每頁顯示{limit.value}筆
                    </option>
                  );
                })
              }
            </Form.Select>
          </Col>
        </Row>
        <Accordion className="mb-3">
          {eachUserRecordSlice.map((user, index) => {
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
        <ReactPaginate
          forcePage={paginationSettings.currentPage}
          breakLabel={"..."}
          previousLabel={"<"}
          nextLabel={">"}
          onPageChange={(page) => {
            handlePageChange(page.selected);
          }}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          pageCount={paginationSettings.lastPage}
          renderOnZeroPageCount={null}
          containerClassName="justify-content-center pagination"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          activeClassName="active"
        />
      </Container>
    </>
  );
}
