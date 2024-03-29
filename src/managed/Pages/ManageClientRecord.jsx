import React, { useEffect, useState } from "react";
import {
  Accordion,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Stack,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import LoadingComponent from "../../components/LoadingComponent";
import PageTitle from "../../components/Title";
import PageTitleHeading from "../../components/PageTitleHeading";
import { get } from "../axios";
import convertType from "../../functions/typeConverter";
import limitPage from "../JsonFile/FilterPageContentSize.json";
import BtnBootstrap from "../../components/BtnBootstrap";
import { useNavigate } from "react-router-dom";

export default function ManageClientRecord() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    loading: true,
    eachUserRecord: [],
    eachUserRecordSlice: [],
    eachUserRecordTempSearch: [],
    searchTextUserName: "",
    searchTextUserResultIsNone: false,
    errorMessage: "",
    paginationSettings: {
      rowsPerPage: 5,
      currentPage: 0,
      lastPage: 1,
    },
  });

  const {
    loading,
    eachUserRecord,
    eachUserRecordSlice,
    eachUserRecordTempSearch,
    searchTextUserName,
    searchTextUserResultIsNone,
    errorMessage,
    paginationSettings,
  } = state;

  const handlePageChange = ({ selected: page }) => {
    const { rowsPerPage } = paginationSettings;
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;

    setState({
      ...state,
      eachUserRecordSlice: eachUserRecordTempSearch.slice(start, end),
      paginationSettings: {
        ...paginationSettings,
        currentPage: page,
      },
    });
  };

  const fetchaAccountData = async ({ api }) => {
    try {
      const response = await get(api);
      const data = await response.data.data;
      const convertData = Array.isArray(data) ? data : [data];
      const { rowsPerPage, currentPage } = paginationSettings;
      const start = currentPage * rowsPerPage;
      const end = start + rowsPerPage;
      setState({
        ...state,
        eachUserRecord: convertData,
        eachUserRecordSlice: convertData.slice(start, end),
        paginationSettings: {
          ...paginationSettings,
          currentPage: 0,
          lastPage: Math.ceil(convertData.length / rowsPerPage),
        },
        errorMessage: "",
        loading: false,
      });
    } catch (error) {
      setState({
        ...state,
        errorMessage: error.response ? error.response.data : error.message,
        loading: false,
      });
    }
  };

  /**
   * 路由至特定使用者的基礎練習紀錄頁面。
   *
   * 此函數依據使用者名稱和影片名稱建構一條到使用者基礎練習紀錄頁面的路徑，
   * 然後使用 `navigate` 函數導航至此路徑。它還將一些狀態傳遞到新的位置，
   * 包括導航的起源和使用者的紀錄。
   *
   * @param {string} name - 使用者的名稱。
   * @param {string} videoName - 影片的名稱。
   * @param {Object} record - 使用者對該影片的紀錄。
   * @returns {void} - 此函數不返回任何內容；它執行一個副作用（路由）。
   * @version 1.0.0
   */
  const navigateTo = (name, videoName, record) => {
    const path = `/ClientRecord/${name}/${videoName}`;
    navigate(path, {
      state: {
        from: "ManageClientRecord",
        userRecord: record.clientRecord,
      },
    });
  };

  useEffect(() => {
    let ignore = false;

    const fetchClientRecord = async () => {
      await fetchaAccountData({ api: "Admin/Record" });
    };

    if (!ignore) {
      fetchClientRecord();
    }

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let filterUserName = eachUserRecord;

    if (searchTextUserName !== "") {
      filterUserName = eachUserRecord.filter((user) =>
        user.name.includes(searchTextUserName)
      );
    }

    const { currentPage, rowsPerPage } = paginationSettings;
    const start = currentPage * rowsPerPage;
    const end = start + rowsPerPage;

    setState({
      ...state,
      eachUserRecordTempSearch: filterUserName,
      eachUserRecordSlice: filterUserName.slice(start, end),
      paginationSettings: {
        ...paginationSettings,
        currentPage: 0,
        lastPage: Math.ceil(filterUserName.length / rowsPerPage),
      },
      searchTextUserResultIsNone: filterUserName.length === 0,
    });
  }, [searchTextUserName, eachUserRecord, paginationSettings.rowsPerPage]);

  // 載入中動畫
  if (loading) {
    return (
      <LoadingComponent title="紀錄資訊欄位" text="紀錄資訊載入中，請稍後" />
    );
  }

  return (
    <>
      <PageTitle title="臺大醫院雲林分院-衛教系統 使用者紀錄管理" />
      <PageTitleHeading text={"紀錄資訊欄位"} styleOptions={3} />

      <Container>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} className="p-2">
            <Form>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  defaultValue={searchTextUserName}
                  placeholder="使用者名稱搜尋.."
                  style={{ boxShadow: "none" }}
                  onChange={(e) =>
                    setState({ ...state, searchTextUserName: e.target.value })
                  }
                />
              </InputGroup>
            </Form>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={{ span: 4, offset: 8 }}
            lg={{ span: 4, offset: 8 }}
          >
            <Form.Select
              className="mt-1"
              aria-label="請選擇每頁顯示筆數"
              onChange={(event) =>
                setState({
                  ...state,
                  paginationSettings: {
                    ...paginationSettings,
                    currentPage: 0,
                    rowsPerPage: Number(event.target.value),
                  },
                })
              }
              selected={paginationSettings.rowsPerPage}
            >
              {limitPage.map((limit) => (
                <option key={limit.id} value={limit.value}>
                  每頁顯示{limit.value}筆
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        {searchTextUserResultIsNone ? (
          <Row>
            <Col md={12} className="p-2">
              <p className="text-center fs-4 m-0">查無使用者</p>
            </Col>
          </Row>
        ) : (
          <>
            <Accordion className="mb-3">
              {eachUserRecordSlice.map((user) => (
                <Accordion.Item eventKey={user.name} key={user.name}>
                  <Accordion.Header>{user.name}</Accordion.Header>
                  <Accordion.Body>
                    {user.have_video === "使用者目前尚未有勾選之影片" ? (
                      <div>使用者目前尚未有勾選之影片</div>
                    ) : (
                      <Accordion>
                        {user.record
                          .sort((a, b) => a.videoType - b.videoType)
                          .map((record) =>
                            record.videoType === 0 || record.videoType === 1 ? (
                              <Accordion.Item
                                eventKey={record.videoName}
                                key={record.videoName}
                              >
                                <Accordion.Header>
                                  <p>
                                    <b
                                      className={
                                        record.videoType === 2
                                          ? "text-success"
                                          : record.videoType === 1
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
                                        <Col xs={12} sm={12} md={6}>
                                          總{convertType(record.videoType)}
                                          次數：
                                          <b>{record.totalPraticeTimes}</b>
                                        </Col>
                                        <Col xs={12} sm={12} md={6}>
                                          總{convertType(record.videoType)}
                                          準確率：
                                          <b>{record.record_result}%</b>
                                        </Col>
                                      </Row>
                                      {record.totalQuiz.map((quiz, index) => (
                                        <Row key={index} className="mt-2">
                                          <p className="fs-5">
                                            第{index + 1}章節
                                          </p>
                                          <Col xs={12} sm={6} md={4}>
                                            是否為必答題：
                                            <b className="text-danger">
                                              {quiz.video_must_correct === 1
                                                ? "是"
                                                : "否"}
                                            </b>
                                          </Col>
                                          <Col xs={12} sm={6} md={4}>
                                            {convertType(record.videoType)}
                                            次數：
                                            <b>
                                              {quiz.eachQuestionPraticeTimes}
                                            </b>
                                          </Col>
                                          <Col md={4} sm={6} xs={8}>
                                            {convertType(record.videoType)}
                                            準確率：
                                            <b>
                                              {quiz.eachQuizAccuracy * 100}%
                                            </b>
                                          </Col>
                                        </Row>
                                      ))}
                                    </Container>
                                  )}
                                </Accordion.Body>
                              </Accordion.Item>
                            ) : (
                              <Accordion.Item
                                eventKey={record.videoName}
                                key={record.videoName}
                              >
                                <Accordion.Header>
                                  <p>
                                    <b
                                      className={
                                        record.videoType === 2
                                          ? "text-success"
                                          : record.videoType === 1
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
                                  <Container>
                                    <Row className="mb-2">
                                      <Col xs={12} sm={12} md={6}>
                                        總練習次數：
                                        <b>{record.totalPraticeTimes}次</b>
                                      </Col>
                                      <Col xs={12} sm={12} md={6}>
                                        目前最高分數：
                                        <b
                                          className={
                                            record.record_result !== 100 ||
                                            record.record_result === null
                                              ? "text-danger"
                                              : "text-success"
                                          }
                                        >
                                          {record.record_result
                                            ? record.record_result
                                            : 0}
                                          分
                                        </b>
                                      </Col>
                                    </Row>
                                    {record.record_result !== null && (
                                      <Stack gap={1}>
                                        <BtnBootstrap
                                          text="查看詳細紀錄"
                                          btnType="button"
                                          btnSize="md"
                                          variant="outline-secondary"
                                          onClickEventName={() => {
                                            navigateTo(
                                              user.name,
                                              record.videoName,
                                              record
                                            );
                                          }}
                                        />
                                      </Stack>
                                    )}
                                  </Container>
                                </Accordion.Body>
                              </Accordion.Item>
                            )
                          )}
                      </Accordion>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
            <ReactPaginate
              forcePage={paginationSettings.currentPage}
              breakLabel={"..."}
              previousLabel={"<"}
              nextLabel={">"}
              onPageChange={handlePageChange}
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
          </>
        )}
      </Container>
    </>
  );
}
