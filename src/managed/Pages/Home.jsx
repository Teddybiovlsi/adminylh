import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { get } from "../axios";
import ReactPaginate from "react-paginate";
import ToolTipBtn from "../../components/ToolTipBtn";
import { toast } from "react-toastify";
import ToastAlert from "../../components/ToastAlert";
import LoadingComponent from "../../components/LoadingComponent";
import ErrorMessageComponent from "../../components/ErrorMessageComponent";
import VideoNavbar from "../../components/VideoNavBar";

import ClassList from "../JsonFile/SelectClassTypeList.json";
import FilterType from "../JsonFile/FilterVideoType.json";
import LanguageList from "../JsonFile/SelectLanguageList.json";
import limitPage from "../JsonFile/FilterPageContentSize.json";

import convertType from "../../functions/typeConverter";
import styles from "../../styles/pages/HomePage.module.scss";
import useModal from "../../hooks/useModal";

export default function Home() {
  const navigate = useNavigate();

  // 請求瀏覽器資料
  const { token, email, powerDiscription } = JSON.parse(
    localStorage?.getItem("manage") || sessionStorage?.getItem("manage") || "{}"
  );

  // 影片資料狀態
  const initialState = {
    createUserButton: true,
    errorFilterMessage: "",
    errorMessage: "",
    filterVideoData: [],
    loading: true,
    paginationSettings: {
      currentPage: 0,
      lastPage: 1,
      rowsPerPage: 5,
    },
    selectVideoLanguage: 0,
    selectVideoPratice: 2,
    selectVideoType: 0,
    selectVideoindex: [],
    showData: [],
    videoData: [
      {
        id: 0,
        video_class: "",
        video_class_index: "",
        video_id: "",
        video_language: "",
        video_language_index: "",
        video_name: "",
        video_path: "",
      },
    ],
  };

  const [state, setState] = useState(initialState);

  const {
    createUserButton, // 創建帳號按鈕
    errorFilterMessage, // 篩選查無資料訊息
    errorMessage, // 錯誤訊息
    filterVideoData, // 篩選後的影片資料
    loading, // 載入中
    paginationSettings, // 分頁設定
    selectVideoLanguage, // 選擇的影片語言
    selectVideoPratice, // 選擇的影片練習/測驗
    selectVideoType, // 選擇的影片類別
    selectVideoindex, // 選擇的影片ID
    showData, // 顯示的影片資料
    videoData, // 影片原始資料(API取得)
  } = state;

  const [disabledEditBtn, setDisabledEditBtn] = useState(false);
  const [disabledDelBtn, setDisabledDelBtn] = useState(false);
  // 主頁上方Navbar選單(新增/刪除影片)
  const [searchTextVideo, setSearchTextVideo] = useState("");

  const [showAddVideoModal, handleShowAddVideoModal, handleCloseAddVideoModal] =
    useModal(false);

  const [showDeleteVideoModal, setShowDeleteVideoModal] = useState(false);

  const handleEditVideo = () => {
    if (selectVideoindex.length === 0) {
      showErrorAndDisableButton(
        "請勾選影片，再點選編輯按鍵",
        setDisabledEditBtn
      );
    } else if (selectVideoindex.length > 1) {
      showErrorAndDisableButton("一次僅限勾選一個影片進行編輯");
    } else {
      const [video] = videoData.filter((item) =>
        selectVideoindex.includes(item.id)
      );
      navigate("/Admin/Edit/Video", {
        state: {
          videoIndex: selectVideoindex[0],
          videoLink: video.video_path,
          videoID: video.video_id,
        },
      });
    }
  };

  const handleShowDeleteVideoModal = () => {
    if (selectVideoindex.length === 0) {
      showErrorAndDisableButton(
        "請勾選影片，再點選刪除按鍵",
        setDisabledDelBtn
      );
    } else {
      setShowDeleteVideoModal(true);
    }
  };

  const showErrorAndDisableButton = (message, setDisableBtn) => {
    toast.error(`${message}`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setDisableBtn(true);
    setTimeout(() => {
      setDisableBtn(false);
    }, 3800);
  };

  const handleCloseDeleteVideoModal = () => setShowDeleteVideoModal(false);

  const captchaRef = useRef(null);
  // 刪除影片送出事件
  const handleDeleteSubmit = async (event) => {
    event.preventDefault();
    const token = captchaRef.current?.getValue();
    token == "" && toast.error("請勾選我不是機器人", { theme: "light" });
  };

  // first render, get video data
  useEffect(() => {
    let ignore = false;

    const fetchVideoDataAsync = async () => {
      await fetchVideoData({
        api: `videos/${token}/${email}`,
      });
    };

    if (!ignore) {
      fetchVideoDataAsync();
    }
    return () => {
      ignore = true;
    };
  }, []);
  // get video data async function
  const fetchVideoData = async ({ api }) => {
    try {
      const { data } = await get(api);
      const videoData = data.data;
      const convertData = Array.isArray(videoData) ? videoData : [videoData];
      setState({
        ...state,
        errorMessage: "",
        videoData: convertData,
        filterVideoData: convertData,
        showData: convertData.slice(0, rowsPerPage),
        loading: false,
        paginationSettings: {
          ...paginationSettings,
          currentPage: 0,
          lastPage: Math.ceil(convertData.length / rowsPerPage),
        },
      });
    } catch (error) {
      console.log(error.response.data);
      if (
        error.response?.data?.message === "登入逾時，請重新登入" &&
        error.response?.status === 404
      ) {
        handleSessionTimeout();
      }
      setState({
        ...state,
        errorMessage: error.response?.data?.message ?? "發生錯誤",
        loading: false,
        videoData: [],
        filterVideoData: [],
        showData: [],
      });
    }
  };

  const handleSessionTimeout = () => {
    alert("登入逾時，請重新登入");
    if (sessionStorage.getItem("user")) sessionStorage.clear();
    if (localStorage.getItem("user")) localStorage.clear();
    navigate("/");
  };

  const filterVideos = useCallback(
    (data) => {
      if (selectVideoLanguage !== 0) {
        data = data.filter(
          (item) => item.video_language_index === selectVideoLanguage
        );
      }

      if (selectVideoType !== 0) {
        data = data.filter(
          (item) => item.video_class_index === selectVideoType
        );
      }

      if (selectVideoPratice !== 2) {
        data = data.filter((item) => item.video_type === selectVideoPratice);
      }

      if (searchTextVideo !== "") {
        data = data.filter((item) => item.video_name.includes(searchTextVideo));
      }

      return data;
    },
    [selectVideoLanguage, selectVideoType, selectVideoPratice, searchTextVideo]
  );

  const filteredData = useMemo(
    () => filterVideos(videoData),
    [filterVideos, videoData]
  );

  const { rowsPerPage } = paginationSettings;

  useEffect(() => {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    setState({
      ...state,
      showData: filteredData.slice(0, rowsPerPage),
      paginationSettings: {
        ...paginationSettings,
        lastPage: totalPages,
        currentPage: 0,
      },
    });
  }, [filteredData, rowsPerPage]);

  useEffect(() => {
    setState({
      ...state,
      errorFilterMessage: showData.length === 0 ? "該語言/類別中無資料" : "",
    });
  }, [showData]);

  const pickedVideoName = useMemo(() => {
    if (selectVideoindex.length === 0) {
      return [];
    } else if (selectVideoindex.length === videoData.length) {
      return videoData.map((item) => item.video_name);
    } else {
      const names = selectVideoindex.map((item) => {
        const found = videoData.find(
          (element) => element.id == item
        ).video_name;
        return found;
      });
      return [...new Set(names)];
    }
  }, [selectVideoindex, videoData]);

  useEffect(() => {
    setState({
      ...state,
      createUserButton: selectVideoindex.length !== 0 ? false : true,
    });
  }, [selectVideoindex]);

  const handlePageChange = (page) => {
    const start = page * paginationSettings.rowsPerPage;
    const end = start + paginationSettings.rowsPerPage;

    setState({
      ...state,
      showData: filterVideoData.slice(start, end),
      paginationSettings: {
        ...paginationSettings,
        currentPage: page,
      },
    });
  };

  useEffect(() => {
    setState({
      ...state,
      showData: filterVideoData.slice(0, paginationSettings.rowsPerPage),
      paginationSettings: {
        ...paginationSettings,
        lastPage: Math.ceil(
          filterVideoData.length / paginationSettings.rowsPerPage
        ),
        currentPage: 0,
      },
    });
  }, [videoData]);

  const handleSelectVideoindex = (ID) => {
    setState({
      ...state,
      selectVideoindex: selectVideoindex.includes(ID)
        ? selectVideoindex.filter((item) => item !== ID)
        : [...selectVideoindex, ID],
    });
  };

  // 表格標題
  const VideoTitle = () => {
    return (
      <tr>
        <th
          className={styles.container_division_table_rowTable_headingCheckBox}
        >
          {/* <input
            type="checkbox"
            onChange={() => {
              handleSelectAllVideo();
            }}
            checked={isCheckAllVideo}
            className={
              styles.container_division_table_rowTable_heading_checkbox
            }
          /> */}
        </th>
        <th
          className={
            styles.container_division_table_rowTable_headingType_autoHiding
          }
        >
          類別
        </th>
        <th className={styles.container_division_table_rowTable_headingType}>
          練習/測驗
        </th>
        <th
          className={
            styles.container_division_table_rowTable_headingType_autoHiding
          }
        >
          語言
        </th>
        <th className={styles.container_division_table_rowTable_headingName}>
          名稱
        </th>
      </tr>
    );
  };

  const VideoInfo = memo(
    ({
      id,
      video_id,
      video_name,
      video_path,
      video_class,
      video_type,
      video_language,
    }) => {
      return (
        <tr>
          <td className={styles.container_division_table_rowTable_data}>
            <input
              type="checkbox"
              // checked video by video ID
              checked={selectVideoindex.includes(id)}
              onChange={() => {
                handleSelectVideoindex(id);
              }}
              value={id}
              className={styles.container_division_table_rowTable_data_checkbox}
            />
          </td>
          <td
            className={styles.container_division_table_rowTable_data_autoHide}
          >
            {video_class}
          </td>
          <td className={video_type === 0 ? "text-primary" : "text-danger"}>
            {convertType(video_type)}
          </td>
          <td
            className={styles.container_division_table_rowTable_data_autoHide}
          >
            {video_language}
          </td>
          <td className={styles.container_division_table_rowTable_data}>
            <Link
              to={`/Video/`}
              state={{ videoUUID: video_id, videoPath: video_path }}
              className="text-decoration-none"
            >
              {video_name}
            </Link>
          </td>
        </tr>
      );
    }
  );

  if (loading) {
    return <LoadingComponent title="影片資訊欄位" text="資訊載入中" />;
  }

  if (errorMessage) {
    return (
      <ErrorMessageComponent title="影片資訊欄位" errorMessage={errorMessage} />
    );
  }

  return (
    <div className="container pb-4">
      <h1 className={styles.container_firstHeading}>影片資訊欄位</h1>
      <VideoNavbar
        isAdmin={powerDiscription === "Admin" ? true : false}
        handleShowAddVideoModal={handleShowAddVideoModal}
        handleEditVideo={handleEditVideo}
        handleShowDeleteVideoModal={handleShowDeleteVideoModal}
        disabledEditBtn={disabledEditBtn}
        disabledDelBtn={disabledDelBtn}
        searchTextVideo={searchTextVideo}
        setSearchTextVideo={setSearchTextVideo}
      />
      <Container className="mt-2">
        <Row>
          <Row>
            <Col md={4} className="p-0">
              <Form.Select
                aria-label="請選擇影片類型"
                onChange={(event) => {
                  setState({
                    ...state,
                    selectVideoType: Number(event.target.value),
                  });
                }}
              >
                {ClassList.map((item, _) => {
                  return (
                    <option key={item.id} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
            <Col md={4} className="p-0">
              <Form.Select
                aria-label="請選擇影片語言"
                onChange={(event) => {
                  setState({
                    ...state,
                    selectVideoLanguage: Number(event.target.value),
                  });
                }}
                value={selectVideoLanguage}
              >
                {LanguageList.map((item) => {
                  return (
                    <option key={item.id} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
            <Col md={4} className="p-0">
              <Form.Select
                aria-label="請選擇影片練習/測驗"
                onChange={(event) => {
                  setState({
                    ...state,
                    selectVideoPratice: Number(event.target.value),
                  });
                }}
                selected={selectVideoPratice}
              >
                <option value="2">全部</option>
                {FilterType.map((item) => {
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
            <Col md={{ span: 4, offset: 8 }} className="p-0">
              <Form.Select
                className="mt-1"
                aria-label="請選擇每頁顯示筆數"
                onChange={(event) => {
                  setState({
                    ...state,
                    paginationSettings: {
                      ...paginationSettings,
                      rowsPerPage: Number(event.target.value),
                    },
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
        </Row>
      </Container>

      {errorFilterMessage == "" && (
        <div className={`mt-3 mb-3 ${styles.container_division}`}>
          <Table>
            <thead>
              <VideoTitle />
            </thead>
            <tbody>
              {showData.map((info, index) => {
                return <VideoInfo {...info} key={index} />;
              })}
            </tbody>
          </Table>
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
        </div>
      )}

      {errorFilterMessage != "" && (
        <div className={`mt-3 mb-3 ${styles.container_division}`}>
          <h2 className={styles.container_division_secondHeading}>
            {errorFilterMessage}
          </h2>
        </div>
      )}

      <button className={styles.container_button} disabled={createUserButton}>
        <Link
          to={!createUserButton ? "/Client/Register" : null}
          state={{
            videoIndex: selectVideoindex,
            videoName: pickedVideoName,
            videoData: videoData,
          }}
          className={styles.disabledLink}
        >
          <b>
            創建
            <br />
            帳號
          </b>
        </Link>
      </button>
      {/* 新增影片懸浮視窗，會導引至所選擇的表單中 */}
      <Modal show={showAddVideoModal} onHide={handleCloseAddVideoModal}>
        <Modal.Header closeButton>
          <Modal.Title>請選擇新增類型</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`d-flex flex-column justify-content-center`}>
            <Link
              to={{
                pathname: "/Pratice",
              }}
              className={styles.linkContainer_link}
            >
              <h3 className="mt-1 mb-1">練習用表單</h3>
            </Link>

            <Link
              to={{
                pathname: "/Pratice",
              }}
              className={styles.linkContainer_link}
            >
              <h3 className="mt-1 mb-1">測驗用表單</h3>
            </Link>
          </div>
        </Modal.Body>
      </Modal>
      {/* 刪除影片懸浮視窗 */}
      {selectVideoindex.length != 0 && (
        <Modal show={showDeleteVideoModal} onHide={handleCloseDeleteVideoModal}>
          <Modal.Header closeButton>
            <Modal.Title>請再次確認刪除的影片</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ color: "red" }}>
              若影片確認後無誤，請勾選我不是機器人後送出
            </p>
            <div>
              <ReCAPTCHA
                style={{ textAlign: "center" }}
                theme="light"
                sitekey={import.meta.env.VITE_REACT_APP_SITE_KEY_2}
                ref={captchaRef}
                badge="inline"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="送出"
              btnOnclickEventName={handleDeleteSubmit}
              btnSize="nm"
              btnText="送出"
              btnVariant="primary"
              tooltipText="送出"
            />
          </Modal.Footer>
        </Modal>
      )}

      <ToastAlert position="top-center" />
    </div>
  );
}
