import React, { useState, useEffect } from "react";
import {
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import BtnBootstrap from "../../components/BtnBootstrap";
import FilterPageSize from "../JsonFile/FilterPageContentSize.json";
import FilterType from "../JsonFile/FilterVideoType.json";
import ReactPaginate from "react-paginate";
import { get, post } from "../axios";
import ToastAlert from "../../components/ToastAlert";
import convertType from "../../functions/typeConverter";
import useModal from "../../hooks/useModal ";

export default function EditClientVideoID() {
  const { state } = useLocation();
  if (!state) {
    window.location.href = "/";
  }

  const user = JSON.parse(
    localStorage?.getItem("manage") || sessionStorage?.getItem("manage")
  );
  // 將已勾選的帳號存入checkedAccount當中
  const [checkedAccount, setCheckedAccount] = useState(state?.ClientAcc);

  //   存放Modal中暫時勾選的帳號
  const [tempCheckedAccount, setTempCheckedAccount] = useState(
    state?.ClientAcc
  );

  const [tempCheckedVideo, setTempCheckedVideo] = useState([]);
  const [checkedVideo, setCheckedVideo] = useState([]);

  // 進入此頁時，先將所有帳號/影片資料撈出
  // 在後續篩選出已經勾選的帳號
  //   accountInfo 是透過API將所有帳號資料撈出來的資料
  const [accountInfo, setAccountInfo] = useState([]);
  //   videoInfo 是透過API將所有影片資料撈出來的資料
  const [videoData, setVideoData] = useState([]);
  // 將篩選後的資料存入filteraccountInfo當中
  const [filteraccountInfo, setFilteraccountInfo] = useState([]);
  // 將篩選後的資料存入filtervideoData當中
  const [filtervideoData, setFiltervideoData] = useState([]);

  //   存放搜尋結果之帳號資料
  const [searchResult, setSearchResult] = useState([]);
  //  存放搜尋結果之影片資料
  const [searchVideoResult, setSearchVideoResult] = useState([]);

  //   若伺服器發生錯誤，則顯示錯誤訊息
  const [errorMessage, setErrorMessage] = useState("");

  // 搜尋欄位內容(帳號用)
  const [searchText, setSearchText] = useState("");
  // 搜尋欄位內容(影片用)
  const [searchTextVideo, setSearchTextVideo] = useState("");
  // 篩選影片類型(影片用)
  const [searchType, setSearchType] = useState("empty");

  // 存放每頁顯示的資料筆數(帳號用):rowsPerPage
  // 存放每頁顯示的資料筆數(影片用):rowsPerPageVideo
  // 存放目前頁數的資料(帳號用):currentPage
  // 存放目前頁數的資料(影片用):currentPageVideo
  // 存放目前總頁數的資料(帳號用):lastPage
  // 存放目前總頁數的資料(影片用):lastPageVideo
  const [paginationSettings, setPaginationSettings] = useState({
    currentPage: 0,
    currentPageVideo: 0,
    lastPage: 1,
    lastPageVideo: 1,
    rowsPerPage: 5,
    rowsPerPageVideo: 5,
  });
  // 存放目前頁數的資料(帳號用)
  const [showAccountData, setShowAccountData] = useState(
    searchResult.slice(0, paginationSettings.rowsPerPage)
  );
  // 存放目前頁數的資料(影片用)
  const [showVideoData, setShowVideoData] = useState(
    searchVideoResult.slice(0, paginationSettings.rowsPerPageVideo)
  );
  //   顯示帳號列表的Modal
  const [showAccountModal, handleClosedAccountModal, handleShowAccountModal] =
    useModal();

  const [showVideoModal, handleClosedVideoModal, handleShowVideoModal] =
    useModal();

  const handleConfirmCheckedItems = (type, items) => {
    if (type === "account") {
      setCheckedAccount(items);
      handleClosedAccountModal();
    } else if (type === "video") {
      setCheckedVideo(items);
      handleClosedVideoModal();
    }
  };

  let navigate = useNavigate();
  const handleRedirectToManageAccount = () => {
    navigate("/ManageClientAccount", { replace: true });
  };

  const handleSubmit = async () => {
    // 顯示loading圖示
    let id = toast.loading("解鎖中...");
    // 將checkedVideo與checkedAccount的資料透過API傳送到後端
    try {
      const data = {
        checkedAccount: checkedAccount,
        checkedVideo: checkedVideo,
      };
      const response = await post("video/client", data);
      toast.update(id, {
        render: "上傳成功，2秒後將回到管理介面\n請稍後...",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => {
        handleRedirectToManageAccount();
      }, 2000);
    } catch (error) {
      let errorMessage = "上傳失敗，請重新嘗試";
      if (error.code === "ECONNABORTED") {
        errorMessage = "伺服器連線逾時，請重新嘗試";
      }

      toast.update(id, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const fetchData = async ({ api, setData, setSearchResult }) => {
    try {
      const response = await get(api);
      const data = await response.data.data;
      const checkIsArray = Array.isArray(data);
      setData(checkIsArray ? data : [data]);
      setSearchResult(checkIsArray ? data : [data]);
      setErrorMessage("");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error) => {
    if (error.code === "ECONNABORTED") {
      setErrorMessage("伺服器連線逾時，請重新嘗試");
    } else {
      setErrorMessage("上傳失敗，請重新嘗試");
    }
  };

  // Fetch data on page load
  useEffect(() => {
    let ignore = false;

    const fetchDataAsync = async () => {
      await fetchData({
        api: "account",
        setData: setAccountInfo,
        setSearchResult,
      });
      await fetchData({
        api: `videos/${user.token}/${user.email}`,
        setData: setVideoData,
        setSearchResult: setSearchVideoResult,
      });
    };

    if (!ignore) {
      fetchDataAsync();
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
  }, [accountInfo, checkedAccount]);

  useEffect(() => {
    if (searchText !== "") {
      // 過濾帳號資料
      const filteredAccountInfo = accountInfo.filter((item) => {
        return (
          item.client_name.includes(searchText) ||
          item.client_email.includes(searchText) ||
          item.client_account.includes(searchText)
        );
      });

      // 更新搜尋結果
      setSearchResult(filteredAccountInfo);

      // 計算分頁相關狀態
      const rows = filteredAccountInfo.length;
      setPaginationSettings({
        ...paginationSettings,
        currentPage: 0,
        lastPage: Math.ceil(rows / paginationSettings.rowsPerPage),
      });
      setShowAccountData(
        filteredAccountInfo.slice(0, paginationSettings.rowsPerPage)
      );
    } else {
      // 無搜尋條件時，使用所有帳號資料
      setSearchResult(accountInfo);

      // 計算分頁相關狀態
      const rows = accountInfo.length;
      setPaginationSettings({
        ...paginationSettings,
        currentPage: 0,
        lastPage: Math.ceil(rows / paginationSettings.rowsPerPage),
      });
      setShowAccountData(accountInfo.slice(0, paginationSettings.rowsPerPage));
    }
  }, [searchText, accountInfo, paginationSettings.rowsPerPage]);

  useEffect(() => {
    setFiltervideoData(
      videoData.filter((item) => {
        return checkedVideo.includes(item.id);
      })
    );
  }, [videoData, checkedVideo]);

  useEffect(() => {
    let filteredVideoData = videoData;

    if (searchTextVideo !== "") {
      filteredVideoData = filteredVideoData.filter((item) =>
        item.video_name.includes(searchTextVideo)
      );
    }

    if (searchType !== "empty") {
      filteredVideoData = filteredVideoData.filter(
        (item) => item.video_type === searchType
      );
    }

    // 更新搜尋結果
    setSearchVideoResult(filteredVideoData);

    // 計算分頁相關狀態
    const rows = filteredVideoData.length;
    const newPaginationSettings = {
      ...paginationSettings,
      currentPageVideo: 0,
      lastPageVideo: Math.ceil(rows / paginationSettings.rowsPerPageVideo),
    };
    setPaginationSettings(newPaginationSettings);

    // 更新顯示的影片資料
    setShowVideoData(
      filteredVideoData.slice(0, newPaginationSettings.rowsPerPageVideo)
    );
  }, [
    searchType,
    searchTextVideo,
    videoData,
    paginationSettings.rowsPerPageVideo,
  ]);

  // 頁數發生變化時，重新計算要顯示的資料（帳號或影片用）
  const handlePageChange = (page, isAccountPage) => {
    if (isAccountPage) {
      const start = page * Number(paginationSettings.rowsPerPage);
      const end = start + Number(paginationSettings.rowsPerPage);
      setPaginationSettings({
        ...paginationSettings,
        currentPage: page,
      });
      if (searchText !== "") {
        setShowAccountData(searchResult.slice(start, end));
      } else {
        setShowAccountData(accountInfo.slice(start, end));
      }
    } else {
      const start = page * Number(paginationSettings.rowsPerPageVideo);
      const end = start + Number(paginationSettings.rowsPerPageVideo);
      setPaginationSettings({
        ...paginationSettings,
        currentPageVideo: page,
      });
      if (searchTextVideo !== "") {
        setShowVideoData(searchVideoResult.slice(start, end));
      } else {
        setShowVideoData(videoData.slice(start, end));
      }
    }
  };
  // 使用於勾選帳號或影片
  const handleToggleItem = (itemID, setFunction) => {
    setFunction((prevItems) =>
      prevItems.includes(itemID)
        ? prevItems.filter((item) => item !== itemID)
        : [...prevItems, itemID]
    );
  };

  // Usage for handling checked accounts
  const handleCheckedAccount = (ClientID) => {
    handleToggleItem(ClientID, setTempCheckedAccount);
  };

  // Usage for handling checked videos
  const handleCheckedVideo = (VideoID) => {
    handleToggleItem(VideoID, setTempCheckedVideo);
  };

  return (
    <div className="container pb-4">
      <h1 className="fw-bold mt-2 mb-2">批次勾選影片</h1>
      <Container>
        <Row>
          <Col md={6}>
            <ListGroup as="ol" numbered>
              <h5 className="fw-bold">選擇之帳號：</h5>
              {filteraccountInfo.map((item, index) => {
                return (
                  <ListGroup.Item
                    key={index}
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{item.client_name}</div>
                      帳號：{item.client_account}
                      <br />
                      信箱：{item.client_email}
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
            <BtnBootstrap
              variant="outline-secondary"
              btnPosition="w-100 btn btn-lg"
              text={"增減帳號"}
              onClickEventName={handleShowAccountModal}
            />
          </Col>
          <Col md={6}>
            <ListGroup as="ol" numbered>
              <h5 className="fw-bold">選擇之影片：</h5>
              {filtervideoData.map((item, index) => {
                return (
                  <ListGroup.Item
                    key={index}
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">影片名稱：{item.video_name}</div>
                      類型：{item.video_class}
                      <br />
                      語言：{item.video_language}
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
            <BtnBootstrap
              variant="outline-secondary"
              btnPosition="w-100 btn btn-lg"
              text={"增減影片"}
              onClickEventName={handleShowVideoModal}
            />
          </Col>
        </Row>
      </Container>

      {/* 帳號類 */}
      <Modal show={showAccountModal} onHide={handleClosedAccountModal}>
        <Modal.Header closeButton>
          <Modal.Title>請選擇新增之帳號</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Form.Group as={Col}>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="帳號搜尋.."
                    style={{ boxShadow: "none" }}
                    defaultValue={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Row>
            <Row>
              <Col>
                <Form.Select
                  aria-label="請選擇每頁資料筆數"
                  onChange={(e) => {
                    setPaginationSettings({
                      ...paginationSettings,
                      rowsPerPage: e.target.value,
                    });
                  }}
                  className="w-50 float-end mb-2"
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
              <ListGroup as="ol" numbered>
                {showAccountData.map((item, index) => {
                  return (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      label={
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">{item.client_name}</div>
                          帳號：{item.client_account}
                          <br />
                          信箱：{item.client_email}
                        </div>
                      }
                      value={item.client_unique_id}
                      checked={tempCheckedAccount.includes(
                        item.client_unique_id
                      )}
                      onChange={() => {
                        handleCheckedAccount(item.client_unique_id);
                      }}
                    />
                  );
                })}
              </ListGroup>
            </Row>
            <Row>
              <ReactPaginate
                forcePage={paginationSettings.currentPage}
                breakLabel={"..."}
                nextLabel={">"}
                previousLabel={"<"}
                onPageChange={(page) => handlePageChange(page.selected, true)}
                pageCount={paginationSettings.lastPage}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                containerClassName="justify-content-center pagination"
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <BtnBootstrap
            btnSize="md"
            variant="outline-secondary"
            text={"取消"}
            onClickEventName={() => {
              handleClosedAccountModal();
            }}
          />
          <BtnBootstrap
            btnSize="md"
            variant="outline-primary"
            text={"確認"}
            onClickEventName={() => {
              handleConfirmCheckedItems("account", tempCheckedAccount);
            }}
          />
        </Modal.Footer>
      </Modal>

      {/* 影片類 */}
      <Modal show={showVideoModal} onHide={handleClosedVideoModal}>
        <Modal.Header closeButton>
          <Modal.Title>請選擇新增之影片</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Form.Group as={Col}>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    defaultValue={searchTextVideo}
                    placeholder="影片搜尋.."
                    style={{ boxShadow: "none" }}
                    onChange={(e) => {
                      setSearchTextVideo(e.target.value);
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Row>
            <Row className="mt-2 mb-2">
              <Col md={6}>
                <Form.Select
                  aria-label="請選擇影片練習/測驗"
                  onChange={(e) => {
                    e.target.value === "empty"
                      ? setSearchType("empty")
                      : setSearchType(Number(e.target.value));
                  }}
                >
                  <option value="empty">選擇影片練習/測驗</option>
                  {FilterType.map((item, _) => {
                    return (
                      <option key={item.id} value={item.value}>
                        {item.label}
                      </option>
                    );
                  })}
                </Form.Select>
              </Col>

              <Col md={6}>
                <Form.Select
                  aria-label="請選擇每頁資料筆數"
                  onChange={(e) => {
                    setPaginationSettings({
                      ...paginationSettings,
                      rowsPerPageVideo: e.target.value,
                    });
                  }}
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
              <ListGroup as="ol" numbered>
                {showVideoData.map((item, index) => {
                  return (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      label={
                        <Container className="ms-2">
                          <Col>
                            <Row className="fw-bold">
                              <p className="m-0 p-0">
                                影片名稱：{item.video_name}
                                <b
                                  className={
                                    item.video_type == 0
                                      ? "text-primary"
                                      : "text-danger"
                                  }
                                >
                                  ({convertType(item.video_type)})
                                </b>
                              </p>
                            </Row>
                            <Row>類型：{item.video_class}</Row>
                            <Row>語言：{item.video_language}</Row>
                          </Col>
                        </Container>
                      }
                      value={item.id}
                      checked={tempCheckedVideo.includes(item.id)}
                      onChange={() => {
                        handleCheckedVideo(item.id);
                      }}
                    />
                  );
                })}
              </ListGroup>
            </Row>
            <Row>
              <ReactPaginate
                forcePage={paginationSettings.currentPageVideo}
                breakLabel={"..."}
                nextLabel={">"}
                previousLabel={"<"}
                onPageChange={(page) => handlePageChange(page.selected, false)}
                pageCount={paginationSettings.lastPageVideo}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                containerClassName="justify-content-center pagination"
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <BtnBootstrap
            btnSize="md"
            variant="outline-secondary"
            text={"取消"}
            onClickEventName={handleClosedVideoModal}
          />
          <BtnBootstrap
            btnSize="md"
            variant="outline-primary"
            text={"確認"}
            onClickEventName={() => {
              handleConfirmCheckedItems("video", tempCheckedVideo);
            }}
          />
        </Modal.Footer>
      </Modal>

      <button
        // className={styles.container_button}
        style={{
          borderRadius: "10px",
          width: "50px",
          height: "50px",
          fontSize: "1.2rem",
          position: "absolute",
          bottom: "5%",
          right: "5%",
          border: "none",
        }}
        disabled={
          checkedAccount.length === 0 || checkedVideo.length === 0
            ? true
            : false
        }
        onClick={handleSubmit}
      >
        <b>完成</b>
      </button>
      <ToastAlert />
    </div>
  );
}
