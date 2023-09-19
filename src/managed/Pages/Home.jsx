import limitPage from "../JsonFile/FilterPageContentSize.json";
import LanguageList from "../JsonFile/SelectLanguageList.json";
import ClassList from "../JsonFile/SelectClassTypeList.json";
import { React, useEffect, useState, useRef } from "react";
import {
  Form,
  Table,
  Pagination,
  Modal,
  Navbar,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { get, post } from "../axios";
import { check } from "prettier";
import StatusCode from "../../sys/StatusCode";
import Loading from "../../components/Loading";
import ReactPaginate from "react-paginate";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import ToolTipBtn from "../../components/ToolTipBtn";
import BtnBootstrap from "../../components/BtnBootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import ToastAlert from "../../components/ToastAlert";
import { toast } from "react-toastify";
import LoadingComponent from "../../components/LoadingComponent";
import ErrorMessageComponent from "../../components/ErrorMessageComponent";
import FilterType from "../JsonFile/FilterVideoType.json";
import styles from "../../styles/pages/HomePage.module.scss";

export default function Home() {
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

  const navigate = useNavigate();

  const manage = JSON.parse(
    localStorage?.getItem("manage") || sessionStorage?.getItem("manage")
  );

  // 請求localStorage中的管理者資料
  const [localData, setLocalData] = useState({
    adminToken: manage.token,
    adminMail: manage.email,
  });
  // console.log(localData.adminMail);

  // limit video data size in one page
  const [size, setSize] = useState(10);
  // videoData is an array
  const [videoData, setVideoData] = useState([
    {
      id: 0,
      video_id: "",
      video_name: "",
      video_path: "",
      video_language: "",
      video_class: "",
      video_language_index: "",
      video_class_index: "",
    },
  ]);
  // 利用選單過濾影片資料
  const [filterVideoData, setFilterVideoData] = useState(videoData);

  const [isCheckAllVideo, setIsCheckAllVideo] = useState(false);
  const [selectVideoindex, setSelectVideoindex] = useState([]);
  const [selectVideoName, setSelectVideoName] = useState([]);
  // loading is true, show loading text, until loading is false
  const [loading, setLoading] = useState(false);
  // 取得影片類別
  // selectVideoType is 0, get all video data
  const [selectVideoType, setSelectVideoType] = useState(0);
  // 取得影片練習/測驗
  const [selectVideoPratice, setSelectVideoPratice] = useState(2);

  // 取得影片語系
  // selectVideoLanguage is 0, get all video data
  const [selectVideoLanguage, setSelectVideoLanguage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const [errorFilterMessage, setErrorFilterMessage] = useState("");
  // 創建用戶帳號button
  const [createUserButton, setCreateUserButton] = useState(true);

  const [paginationSettings, setPaginationSettings] = useState({
    rowsPerPage: 5,
    currentPage: 0,
    lastPage: 1,
  });

  // track current page video data size
  const [disabledEditBtn, setDisabledEditBtn] = useState(false);
  const [disabledDelBtn, setDisabledDelBtn] = useState(false);
  // 主頁上方Navbar選單(新增/刪除影片)
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showDeleteVideoModal, setShowDeleteVideoModal] = useState(false);

  const handleShowAddVideoModal = () => setShowAddVideoModal(true);
  const handleCloseAddVideoModal = () => setShowAddVideoModal(false);

  const handleEditVideo = () => {
    if (selectVideoindex.length == 0) {
      toast.error("請勾選影片，再點選編輯按鍵", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setDisabledEditBtn(true);
      setTimeout(() => {
        setDisabledEditBtn(false);
      }, 3000);
    } else {
      if (selectVideoindex.length > 1) {
        toast.error("一次僅限勾選一個影片進行編輯", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setDisabledEditBtn(true);
        setTimeout(() => {
          setDisabledEditBtn(false);
        }, 3000);
      } else {
        const videoFilterData = videoData.filter((item) =>
          selectVideoindex.includes(item.id)
        );
        navigate("/Admin/Edit/Video", {
          state: {
            videoIndex: selectVideoindex[0],
            videoLink: videoFilterData[0].video_path,
            videoID: videoFilterData[0].video_id,
          },
        });
      }
    }
  };

  const handleShowDeleteVideoModal = () => {
    if (selectVideoindex.length == 0) {
      toast.error("請勾選影片，再點選刪除按鍵", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setDisabledDelBtn(true);
      setTimeout(() => {
        setDisabledDelBtn(false);
      }, 3000);
    } else {
      setShowDeleteVideoModal(true);
    }
  };

  const handleCloseDeleteVideoModal = () => setShowDeleteVideoModal(false);

  const captchaRef = useRef(null);
  // 刪除影片送出事件
  const handleDeleteSubmit = async (event) => {
    event.preventDefault();
    const token = captchaRef.current.getValue();
    token == "" && toast.error("請勾選我不是機器人", { theme: "light" });
  };

  // first render, get video data
  useEffect(() => {
    let ignore = false;

    const fetchVideoDataAsync = async () => {
      await fetchVideoData({
        api: `videos/${localData.adminToken}/${localData.adminMail}`,
      });
    };

    if (!ignore) {
      // set loading to true
      setLoading(true);
      fetchVideoDataAsync();
    }
    return () => {
      ignore = true;
    };
  }, []);
  // get video data async function
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
      setFilterVideoData(checkIsArray ? data : [data]);
      // 將 loading 設為 false
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      // clear error message
      setErrorMessage("");
    } catch (error) {
      console.log(error.response.data);
      //若錯誤狀態碼為440，則清除localStorage中的管理者資料，並跳出提示訊息
      if (
        error.response.data.message == "登入逾時，請重新登入" &&
        error.response.status === 404
      ) {
        handleSessionTimeout();
      }
      // if catch error, clear videoData
      setVideoData([]);
      setFilterVideoData([]);
      // 將 loading 設為 false
      setLoading(false);
      // if error.response is true, get error message
      if (error.response) {
        setErrorMessage(StatusCode(error.response.status));
      }
    }
  };

  const handleSessionTimeout = () => {
    alert("登入逾時，請重新登入");
    if (sessionStorage.getItem("user")) sessionStorage.clear();
    if (localStorage.getItem("user")) localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    if (filterVideoData.length == 0) {
      setErrorFilterMessage("該語言/類別中無資料");
    } else {
      setErrorFilterMessage("");
    }
  }, [filterVideoData]);

  useEffect(() => {
    let filterVideoData = videoData;

    if (Number(selectVideoLanguage) !== 0) {
      filterVideoData = filterVideoData.filter(
        (item) => item.video_language_index === Number(selectVideoLanguage)
      );
    }

    if (Number(selectVideoType) !== 0) {
      filterVideoData = filterVideoData.filter(
        (item) => item.video_class_index === Number(selectVideoType)
      );
    }

    if (selectVideoPratice !== 2) {
      filterVideoData = filterVideoData.filter(
        (item) => item.video_type === selectVideoPratice
      );
    }

    const totalPages = Math.ceil(
      filterVideoData.length / paginationSettings.rowsPerPage
    );

    setPaginationSettings({
      ...paginationSettings,
      lastPage: totalPages,
      currentPage: 0,
    });

    setFilterVideoData(
      filterVideoData.slice(0, paginationSettings.rowsPerPage)
    );
  }, [
    selectVideoPratice,
    selectVideoType,
    selectVideoLanguage,
    paginationSettings.rowsPerPage,
  ]);

  useEffect(() => {
    if (selectVideoindex.length == 0) {
      setSelectVideoName([]);
    } else if (selectVideoindex.length == videoData.length) {
      setSelectVideoName(videoData.map((item) => item.video_name));
    } else {
      selectVideoindex.map((item) => {
        const found = videoData.find(
          (element) => element.id == item
        ).video_name;

        setSelectVideoName(
          selectVideoName.includes(found)
            ? selectVideoName.filter((item) => item == found)
            : [...selectVideoName, found]
        );
      });
    }
  }, [selectVideoindex]);

  useEffect(() => {
    setCreateUserButton(selectVideoindex.length != 0 ? false : true);
  }, [selectVideoindex]);

  const handlePageChange = (page) => {
    setPaginationSettings({
      ...paginationSettings,
      currentPage: page,
    });
    setFilterVideoData(videoData.slice(start, end));
  };

  useEffect(() => {
    setPaginationSettings({
      ...paginationSettings,
      lastPage: Math.ceil(
        filterVideoData.length / paginationSettings.rowsPerPage
      ),
      currentPage: 0,
    });

    setFilterVideoData(videoData.slice(0, paginationSettings.rowsPerPage));
  }, [videoData]);

  // 全選方塊功能(暫時不使用)
  // if select all video, set isCheckAllVideo to true and set selectVideoindex to all video ID
  // const handleSelectAllVideo = () => {
  //   // set isCheckAllVideo to !isCheckAllVideo
  //   setIsCheckAllVideo(!isCheckAllVideo);

  //   // 依照當下頁面所篩選之資料筆數，決定全選會選到的資料範圍

  //   const start = paginationSettings.currentPage * size;
  //   const end = start + size;

  //   isCheckAllVideo
  //     ? setSelectVideoindex([])
  //     : setSelectVideoindex(
  //         filterVideoData.slice(start, end).map((item) => item.id)
  //       );
  // };
  // useEffect(() => {
  //   const start =
  //     paginationSettings.currentPage * paginationSettings.rowsPerPage;
  //   const end = start + paginationSettings.rowsPerPage;
  //   // if selectVideoindex length equal to videoData slice length, set isCheckAllVideo to true
  //   setIsCheckAllVideo(
  //     selectVideoindex.length == videoData.slice(start, end).length
  //   );
  // }, [selectVideoindex, videoData]);
  // ........................................................

  const handleSelectVideoindex = (ID) => {
    // if selectVideoindex includes ID, set selectVideoindex to selectVideoindex filter ID
    // otherwise, set selectVideoindex to selectVideoindex add ID
    setSelectVideoindex(
      selectVideoindex.includes(ID)
        ? selectVideoindex.filter((item) => item !== ID)
        : [...selectVideoindex, ID]
    );
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

  const VideoInfo = ({
    id,
    video_id,
    video_name,
    video_path,
    video_class,
    video_type,
    video_language,
  }) => {
    return (
      <tr key={id}>
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
        <td className={styles.container_division_table_rowTable_data_autoHide}>
          {video_class}
        </td>
        <td className={video_type === 0 ? "text-primary" : "text-danger"}>
          {convertType(video_type)}
        </td>
        <td className={styles.container_division_table_rowTable_data_autoHide}>
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
  };

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
      <Navbar bg="light" variant="light">
        <Container>
          <div className="me-auto">
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="新增影片"
              btnOnclickEventName={() => {
                handleShowAddVideoModal();
              }}
              btnText={
                <i
                  className="bi bi-file-earmark-plus"
                  style={{ fontSize: 1.2 + "rem" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="新增影片"
            />
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="修改影片"
              btnDisabled={
                (selectVideoindex.length == 0 ? true : false) ||
                (disabledEditBtn ? true : false)
              }
              btnOnclickEventName={handleEditVideo}
              btnText={
                <i
                  className="bi bi-pencil-square"
                  style={{ fontSize: 1.2 + "rem" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="編輯影片"
            />
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="刪除影片"
              btnDisabled={
                (selectVideoindex.length == 0 ? true : false) ||
                (disabledDelBtn ? true : false)
              }
              btnOnclickEventName={() => {
                handleShowDeleteVideoModal();
              }}
              btnText={
                <i
                  className="bi bi-trash3-fill"
                  style={{ fontSize: 1.2 + "rem" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="刪除影片"
            />
          </div>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Row>
            <Col md={4} className="p-0">
              <Form.Select
                aria-label="請選擇影片類型"
                onChange={(event) => {
                  setSelectVideoType(event.target.value);
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
                  setSelectVideoLanguage(event.target.value);
                }}
                selected={selectVideoLanguage}
              >
                {LanguageList.map((item, _) => {
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
                  console.log(event.target.value);
                  setSelectVideoPratice(Number(event.target.value));
                }}
                selected={selectVideoPratice}
              >
                <option value="2">全部</option>
                {FilterType.map((item, _) => {
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
                  setPaginationSettings({
                    ...paginationSettings,
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
        </Row>
      </Container>

      {errorFilterMessage == "" && (
        <div className={`mt-3 mb-3 ${styles.container_division}`}>
          <Table>
            <thead>
              <VideoTitle />
            </thead>
            <tbody>
              {filterVideoData.map((info, _) => {
                return <VideoInfo {...info} key={info.id} />;
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
            videoName: selectVideoName,
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
