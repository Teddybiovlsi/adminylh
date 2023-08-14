import { set } from "lodash";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Row,
  InputGroup,
  Table,
  FormLabel,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { get, post } from "../axios";
import BtnBootstrap from "../../components/BtnBootstrap";
import FilterPageSize from "../JsonFile/FilterPageContentSize.json";
import ReactPaginate from "react-paginate";
import ToastAlert from "../../components/ToastAlert";
import { toast } from "react-toastify";

export default function EditClientVideoID() {
  //   若無任何資訊則返回首頁
  if (!useLocation().state) window.location.href = "/";

  const location = useLocation();
  // 將已勾選的帳號存入checkedAccount當中
  const [checkedAccount, setCheckedAccount] = useState(
    location.state?.ClientAcc
  );

  //   存放Modal中暫時勾選的帳號
  const [tempCheckedAccount, setTempCheckedAccount] = useState(
    location.state?.ClientAcc
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
  //   顯示帳號列表的Modal
  const [showAccountModal, setShowAccountModal] = useState(false);
  const handleCloseAccountModal = () => setShowAccountModal(false);
  const handleShowAccountModal = () => setShowAccountModal(true);

  const handleConfirmCheckedAccount = () => {
    setCheckedAccount(tempCheckedAccount);
    handleCloseAccountModal();
  };
  // 搜尋欄位內容(帳號用)
  const [searchText, setSearchText] = useState("");
  // 存放每頁顯示的資料筆數(帳號用)
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // 存放目前頁數(帳號用)
  const [currentPage, setCurrentPage] = useState(1);
  // 存放目前頁數的資料(帳號用)
  const [showData, setShowData] = useState(searchResult.slice(0, rowsPerPage));
  // 存放目前總頁數的資料(帳號用)
  const [lastPage, setLastPage] = useState(1);
  // 存放每頁顯示的資料筆數(影片用)
  const [rowsPerPageVideo, setRowsPerPageVideo] = useState(5);
  // 存放目前頁數(影片用)
  const [currentPageVideo, setCurrentPageVideo] = useState(1);
  // 存放目前頁數的資料(影片用)
  const [showVideoData, setShowVideoData] = useState(
    searchVideoResult.slice(0, rowsPerPage)
  );
  // 存放目前總頁數的資料(影片用)
  const [lastPageVideo, setLastPageVideo] = useState(1);
  // 搜尋欄位內容(影片用)
  const [searchTextVideo, setSearchTextVideo] = useState("");

  //   顯示影片列表的Modal
  const [showVideoModal, setShowVideoModal] = useState(false);
  const handleCloseVideoModal = () => setShowVideoModal(false);
  const handleShowVideoModal = () => setShowVideoModal(true);

  const handleConfirmCheckedVideo = () => {
    setCheckedVideo(tempCheckedVideo);
    handleCloseVideoModal();
  };

  let navigate = useNavigate();
  const handleRedirectToManageAccount = () => {
    navigate("/ManageClientAccount");
  };

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
      setSearchResult(checkIsArray ? data : [data]);

      // clear error message
      setErrorMessage("");
    } catch (error) {
      // if error.response is true, get error message
      if (error.response) {
        setErrorMessage(StatusCode(error.response.status));
      }
    }
  };

  const fetchVideoData = async ({ api }) => {
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
      setVideoData(checkIsArray ? data : [data]);
      setSearchVideoResult(checkIsArray ? data : [data]);
      // clear error message
      setErrorMessage("");
    } catch (error) {
      // if error.response is true, get error message
      if (error.response) {
        setErrorMessage(StatusCode(error.response.status));
      }
    }
  };

  const handleSubmmit = async () => {
    // 顯示loading圖示
    const id = toast.loading("解鎖中...");
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
      if (error.code === "ECONNABORTED") {
        toast.update(id, {
          render: "伺服器連線逾時，請重新嘗試",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(id, {
          render: "上傳失敗，請重新嘗試",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    }
  };

  //   在進入此頁時，先將所有帳號資料進行撈取
  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      //  透過API將所有帳號資料撈出來
      fetchaAccountData({
        api: "account",
      });
      //  透過API將所有影片資料撈出來
      fetchVideoData({
        api: "videos",
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
  }, [accountInfo, checkedAccount]);

  useEffect(() => {
    setFiltervideoData(
      videoData.filter((item) => {
        return checkedVideo.includes(item.id);
      })
    );
  }, [videoData, checkedVideo]);

  useEffect(() => {
    if (searchText !== "") {
      setSearchResult(
        accountInfo.filter((item) => {
          return (
            item.client_name.includes(searchText) ||
            item.client_email.includes(searchText) ||
            item.client_account.includes(searchText)
          );
        })
      );
    } else {
      setSearchResult(accountInfo);
    }
  }, [searchText]);

  useEffect(() => {
    if (searchTextVideo !== "") {
      setSearchVideoResult(
        videoData.filter((item) => {
          return item.video_name.includes(searchTextVideo);
        })
      );
    } else {
      setSearchVideoResult(videoData);
    }
  }, [searchTextVideo]);

  useEffect(() => {
    const rows = searchResult.length;
    setLastPage(Math.ceil(rows / rowsPerPage));
    setShowData(searchResult.slice(0, rowsPerPage));
  }, [searchResult, rowsPerPage]);

  useEffect(() => {
    const rows = searchVideoResult.length;
    setLastPageVideo(Math.ceil(rows / rowsPerPageVideo));
    setShowVideoData(searchVideoResult.slice(0, rowsPerPageVideo));
  }, [searchVideoResult, rowsPerPageVideo]);

  //  頁數發生變化時，重新計算要顯示的資料(帳號用)
  const handlePageChange = (page) => {
    setCurrentPage(page);
    const start = (page - 1) * Number(rowsPerPage);
    // convert rowsPerPage to number
    const end = start + Number(rowsPerPage);
    setShowData(searchVideoResult.slice(start, end));
  };
  //   頁數發生變化時，重新計算要顯示的資料(影片用)
  const handlePageChangeVideo = (page) => {
    setCurrentPageVideo(page);
    const start = (page - 1) * Number(rowsPerPageVideo);
    // convert rowsPerPage to number
    const end = start + Number(rowsPerPageVideo);
    // setShowDataVideo(searchVideoResult.slice(start, end));
  };

  const handleCheckedAccount = (ClientID) => {
    setTempCheckedAccount(
      tempCheckedAccount.includes(ClientID)
        ? tempCheckedAccount.filter((item) => item !== ClientID)
        : [...tempCheckedAccount, ClientID]
    );
  };

  const handleCheckedVideo = (VideoID) => {
    setTempCheckedVideo(
      tempCheckedVideo.includes(VideoID)
        ? tempCheckedVideo.filter((item) => item !== VideoID)
        : [...tempCheckedVideo, VideoID]
    );
  };

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
              onClickEventName={() => {
                handleShowAccountModal();
              }}
            />
          </Col>
          <Col>
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
              onClickEventName={() => {
                handleShowVideoModal();
              }}
            />
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
              <Form.Group as={Col}>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="帳號搜尋.."
                    style={{ boxShadow: "none" }}
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
                    setRowsPerPage(e.target.value);
                    setCurrentPage(1);
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
                {showData.map((item, index) => {
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
                breakLabel={"..."}
                nextLabel={">"}
                previousLabel={"<"}
                onPageChange={(page) => handlePageChange(page.selected + 1)}
                pageCount={lastPage}
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
              handleCloseAccountModal();
            }}
          />
          <BtnBootstrap
            btnSize="md"
            variant="outline-primary"
            text={"確認"}
            onClickEventName={() => {
              handleConfirmCheckedAccount();
            }}
          />
        </Modal.Footer>
      </Modal>

      <Modal show={showVideoModal} onHide={handleCloseVideoModal}>
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
                    placeholder="影片搜尋.."
                    style={{ boxShadow: "none" }}
                    onChange={(e) => {
                      setSearchTextVideo(e.target.value);
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
                    setRowsPerPageVideo(e.target.value);
                    setCurrentPageVideo(1);
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
                {showVideoData.map((item, index) => {
                  return (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      label={
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">
                            影片名稱：{item.video_name}
                          </div>
                          類型：{item.video_class}
                          <br />
                          語言：{item.video_language}
                        </div>
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
                breakLabel={"..."}
                nextLabel={">"}
                previousLabel={"<"}
                onPageChange={(page) =>
                  handlePageChangeVideo(page.selected + 1)
                }
                pageCount={lastPageVideo}
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
              handleCloseVideoModal();
            }}
          />
          <BtnBootstrap
            btnSize="md"
            variant="outline-primary"
            text={"確認"}
            onClickEventName={() => {
              handleConfirmCheckedVideo();
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
        onClick={handleSubmmit}
      >
        <b>完成</b>
      </button>
      <ToastAlert />
    </div>
  );
}
