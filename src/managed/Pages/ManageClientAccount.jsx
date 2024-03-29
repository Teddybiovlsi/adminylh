import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { get, del, put, post } from "../axios";
import { useNavigate } from "react-router-dom";
import {
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Navbar,
  Row,
  Table,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import useModal from "../../hooks/useModal";
import BtnBootstrap from "../../components/BtnBootstrap";
import ToolTipBtn from "../../components/ToolTipBtn";
import ShowLockIcon from "../../components/ShowLockIcon";
import ShowInfoIcon from "../../components/ShowInfoIcon";
import ShowVideoIcon from "../../components/ShowVideoIcon";
import LoadingComponent from "../../components/LoadingComponent";
import ErrorMessageComponent from "../../components/ErrorMessageComponent";
import ToastAlert from "../../components/ToastAlert";
import { toast } from "react-toastify";
import CustomState from "../JsonFile/SelectCustomerState.json";
import CustomVideo from "../JsonFile/SelectCustomerVideo.json";
import FilterPageSize from "../JsonFile/FilterPageContentSize.json";
import FilterType from "../JsonFile/FilterVideoType.json";
import convertType from "../../functions/typeConverter";
import styles from "../../styles/pages/ManageClientAccount.module.scss";

export default function ManageClientAccount({ admin }) {
  // 用來儲存修改姓名的資料
  const userName = useRef(null);
  // 用來儲存修改聯絡信箱的資料
  const userEmail = useRef(null);
  // 用來儲存修改密碼的資料
  const userPwd = useRef(null);

  const { token, email, powerDiscription } = admin;

  const [accountInfo, setAccountInfo] = useState([]);
  // 用來儲存搜尋欄位的資料
  const [searchInfo, setSearchInfo] = useState("");

  const [videoData, setVideoData] = useState([]);

  const [searchVideoResult, setSearchVideoResult] = useState([]);

  const [showVideoData, setShowVideoData] = useState([]);

  // 用來儲存篩選後的資料
  const [filteraccountInfo, setFilteraccountInfo] = useState([]);
  // 用來儲存篩選後的資料，用於懸浮視窗Modal
  const [filterPersonInfo, setFilterPersonInfo] = useState(null);
  // 用來儲存篩選後的使用者影片資料，用於懸浮視窗Modal
  const [filterVideoInfo, setFilterVideoInfo] = useState(null);

  const [searchTextVideo, setSearchTextVideo] = useState("");

  const [searchType, setSearchType] = useState("empty");

  const [tempCheckedVideo, setTempCheckedVideo] = useState([]);

  // 用來儲存是否全選帳號
  const [isCheckAllAccount, setIsCheckAllAccount] = useState(false);
  // 用來儲存選擇的帳號
  const [selectAccount, setSelectAccount] = useState([]);
  // 用來儲存用戶狀態(正常使用中/鎖定中)
  const [userState, setUserState] = useState(2);
  // 用來儲存用戶影片狀態(有影片/無影片)
  const [userVideo, setUserVideo] = useState(2);
  // 若帳號資訊尚未載入完成，則顯示Loading
  const [loading, setLoading] = useState(true);
  // 若帳號資訊載入失敗，則顯示錯誤訊息
  const [errorMessage, setErrorMessage] = useState("");

  const [paginationSettings, setPaginationSettings] = useState({
    currentPageAccount: 0,
    lastPageAccount: 1,
    rowsPerPageAccount: 5,
    currentPageVideo: 0,
    lastPageVideo: 1,
    rowsPerPageVideo: 5,
  });

  // 若沒有選擇任何帳號，則禁用編輯、解鎖、刪除按鈕
  const [isDisableMultiAddBtn, setIsDisableMultiAddBtn] = useState(false);
  const [isDisableEditBtn, setIsDisableEditBtn] = useState(false);
  const [isDisableUnlockBtn, setIsDisableUnlockBtn] = useState(false);
  const [isDisableDeleteBtn, setIsDisableDeleteBtn] = useState(false);
  const [isDisableEditProfileBtn, setIsDisableEditProfileBtn] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const [
    showProfileVideoModal,
    handleClosedProfileVideoModal,
    handleShowProfileVideoModal,
  ] = useModal();

  const handleDeleteVideo = () => {
    // put selectAccount value into an array
    const data = [selectAccount];
    // put data array into a hyperlink
    const api = `client/${data}`;
    // call fetchDeleteVideo function
    fetchDeleteAccount({ api });
  };

  // 以下是帳號資訊欄位上方功能列的選項
  // 批次新增帳號
  let navigate = useNavigate();
  const handleMultiAddAccount = () => {
    navigate("/MultiAddUser");
  };
  // 批次新增帳戶影片
  const handleMultiAddVideo = () => {
    navigate("/MultiAddVideo", { state: { ClientAcc: selectAccount } });
  };

  // 編輯帳號
  const handleEditAccount = (Clientid) => {
    const name = userName.current.value;
    const email = userEmail.current.value;
    const pwd = userPwd.current.value;

    let data = {};

    if (email !== "") {
      data.clientEmail = email;
    }

    if (name !== "") {
      data.clientName = name;
    }

    if (pwd !== "") {
      data.clientPWD = pwd;
    }

    if (Object.keys(data).length > 0) {
      fetchUpdateUserProfile({ api: `client/${Clientid}`, data });
    }
  };
  // 解鎖帳號
  const handleUnlockAccount = () => {
    fetchUnlockAccount({
      api: `client/${[selectAccount]}/unlock`,
    });
    setTimeout(() => {
      navigate(0);
    }, 2000);
  };
  // 復原帳號
  const handleRestoreAccount = () => {
    navigate("/RestoreAccount");
  };

  // 以下是帳號資訊欄取得資料的流程
  // first render, get acoount data
  useEffect(() => {
    let ignore = false;
    const fetchDataAsync = async () => {
      await fetchData({
        api: "account",
        setData: setAccountInfo,
        setSearchResult: setFilteraccountInfo,
        rowsPerPage: paginationSettings.rowsPerPageAccount,
      });
      await fetchData({
        api: `videos/${token}/${email}`,
        setData: setVideoData,
        setSearchResult: setShowVideoData,
        rowsPerPage: paginationSettings.rowsPerPageVideo,
      });
    };
    if (!ignore) {
      fetchDataAsync();
    }
    return () => {
      ignore = true;
    };
  }, []);

  const fetchData = async ({ api, setData, setSearchResult, rowsPerPage }) => {
    try {
      const response = await get(api);
      const data = await response.data.data;
      const converData = Array.isArray(data) ? data : [data];
      setData(converData);
      setSearchResult(converData.slice(0, rowsPerPage));
      setErrorMessage("");
      setLoading(false);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleApiError = (error) => {
    if (error.code === "ECONNABORTED") {
      setErrorMessage("伺服器連線逾時，請重新嘗試");
    } else {
      setErrorMessage("上傳失敗，請重新嘗試");
    }
  };
  const filterUserInfo = useCallback(
    (data) => {
      data =
        userState !== 2
          ? data.filter((item) => item.client_is_lock === userState)
          : data;
      data =
        userVideo !== 2
          ? data.filter((item) =>
              userVideo === 0
                ? !item.client_have_video.length
                : item.client_have_video.length
            )
          : data;
      data =
        searchInfo !== ""
          ? data.filter((item) => {
              return (
                item.client_account.includes(searchInfo) ||
                item.client_name.includes(searchInfo)
              );
            })
          : data;
      return data;
    },
    [userState, userVideo, searchInfo]
  );

  const filteredAccountData = useMemo(
    () => filterUserInfo(accountInfo),
    [filterUserInfo, accountInfo]
  );

  const { rowsPerPageAccount, rowsPerPageVideo } = paginationSettings;

  useEffect(() => {
    const totalPages = Math.ceil(
      filteredAccountData.length / rowsPerPageAccount
    );

    setFilteraccountInfo(filteredAccountData.slice(0, rowsPerPageAccount));

    setPaginationSettings({
      ...paginationSettings,
      lastPageAccount: totalPages,
      currentPageAccount: 0,
    });
  }, [filteredAccountData, rowsPerPageAccount]);

  useEffect(() => {
    const totalPages = Math.ceil(videoData.length / rowsPerPageVideo);

    setPaginationSettings({
      ...paginationSettings,
      lastPageVideo: totalPages,
      currentPageVideo: 0,
    });
  }, [videoData]);

  // useEffect(() => {
  //   const totalPages = Math.ceil(searchVideoResult.length / rowsPerPageVideo);

  //   setSearchVideoResult(searchVideoResult.slice(0, rowsPerPageVideo));

  //   setPaginationSettings({
  //     ...paginationSettings,
  //     lastPageVideo: totalPages,
  //     currentPageVideo: 0,
  //   });
  // }, [searchVideoResult, rowsPerPageVideo]);

  const handlePageChange = (page, isVideo) => {
    if (isVideo) {
      const start = page * rowsPerPageVideo;
      const end = start + rowsPerPageVideo;

      if (searchVideoResult.length === 0) {
        setShowVideoData(videoData.slice(start, end));
      } else {
        setShowVideoData(searchVideoResult.slice(start, end));
      }
      setPaginationSettings({
        ...paginationSettings,
        currentPageVideo: page,
      });
    } else {
      const start = page * Number(rowsPerPageAccount);
      const end = start + Number(rowsPerPageAccount);

      setFilteraccountInfo(filteredAccountData.slice(start, end));
      setPaginationSettings({
        ...paginationSettings,
        currentPageAccount: page,
      });
    }
  };

  // 當篩選後的資料長度為0時，顯示錯誤訊息
  // useEffect(() => {
  //   if (filteraccountInfo.length > 0) {
  //     // 在filteraccountInfo有所變動時，檢查是否長度一致，若一致則全選，反之則取消全選
  //     if (filteraccountInfo.length === selectAccount.length) {
  //       setIsCheckAllAccount(true);
  //     } else {
  //       setIsCheckAllAccount(false);
  //     }
  //   }
  // }, [filteraccountInfo]);

  // 執行刪除帳號API
  const fetchDeleteAccount = async ({ api }) => {
    const id = toast.loading("刪除使用者中...");
    try {
      const response = await del(api);

      toast.update(id, {
        render: "刪除成功，3秒後將重新整理頁面",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate(0);
      }, 2000);
    } catch (error) {
      toast.update(id, {
        render: "刪除失敗，請稍後再試",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };
  // 執行解鎖帳號API
  const fetchUnlockAccount = async ({ api }) => {
    const id = toast.loading("解鎖中...");
    try {
      const response = await get(api);
      const message = response.data.message;
      toast.update(id, {
        render: "帳號解鎖成功",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(id, {
        render: "解鎖失敗",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };
  // 更新使用者資訊
  const fetchUpdateUserProfile = async ({ api, data }) => {
    const id = toast.loading("更新中...");
    try {
      await put(api, data);

      toast.update(id, {
        render: "更新成功，3秒後將重新整理頁面",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      handleCloseAccountModal();
      setTimeout(() => {
        // set loading
        setLoading(true);
        // clear selectAccount
        setSelectAccount([]);
        // clear accountInfo
        setAccountInfo([]);
        // clear filteraccountInfo
        setFilteraccountInfo([]);
        // fetch data again
        setTimeout(() => {
          fetchData({
            api: "account",
            setData: setAccountInfo,
            setSearchResult: setFilteraccountInfo,
          });
        }, 3000);
      }, 3000);
    } catch (error) {
      toast.update(id, {
        render: "更新失敗",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };
  // 更新使用者影片資訊
  const fetchUpdateUserVideo = async ({ api, data }) => {
    const id = toast.loading("更新中...");

    try {
      await post(api, data);
      toast.update(id, {
        render: "更新成功，3秒後將重新整理頁面",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      handleCloseVidoeModal();
      setTimeout(() => {
        navigate(0);
      }, 3000);
    } catch (error) {
      toast.update(id, {
        render: "更新失敗",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  // 新增影片篩選條件
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
    // 顯示結果的第一頁
    setShowVideoData(filteredVideoData.slice(0, rowsPerPageVideo));

    // 計算分頁相關狀態
    const rows = filteredVideoData.length;

    const newPaginationSettings = {
      ...paginationSettings,
      currentPageVideo: 0,
      lastPageVideo: Math.ceil(rows / paginationSettings.rowsPerPageVideo),
    };
    setPaginationSettings(newPaginationSettings);
  }, [searchTextVideo, searchType, paginationSettings.rowsPerPageVideo]);

  // 將姓名敏感資訊做處理
  const handleNameAccount = (name) => {
    if (name.length === 3) {
      return name.slice(0, 1) + "O" + name.slice(2, 3);
    } else if (name.length === 4) {
      return name.slice(0, 1) + "OO" + name.slice(3, 4);
    } else if (name.length === 2) {
      return name.slice(0, 1) + "O";
    } else {
      return name;
    }
  };

  // 若帳號欄位有任一被勾選，則編輯、解鎖、刪除按鈕皆可使用
  useEffect(() => {
    if (selectAccount.length === 0) {
      setIsDisableEditBtn(true);
    } else {
      setIsDisableEditBtn(false);
    }
  }, [selectAccount]);
  // 若帳號欄位全部被勾選，則全選按鈕勾選
  useEffect(() => {
    // 在初始render時，selectAccount為空陣列，也因為filteraccountInfo也為空陣列
    // filteraccountInfo.length > 0，則會導致isCheckAllAccount一直為true
    filteraccountInfo.length > 0 &&
      (selectAccount.length === filteraccountInfo.length
        ? setIsCheckAllAccount(true)
        : setIsCheckAllAccount(false));
  }, [selectAccount]);

  // 全選帳號
  const handleSelectAllVideo = () => {
    setIsCheckAllAccount(!isCheckAllAccount);

    isCheckAllAccount
      ? setSelectAccount([])
      : setSelectAccount(
          filteraccountInfo.map((item) => item.client_unique_id)
        );
  };

  // 單一選擇帳號
  const handleSelectAccount = (clientUniqueId) => {
    setSelectAccount(
      selectAccount.includes(clientUniqueId)
        ? selectAccount.filter((item) => item !== clientUniqueId)
        : [...selectAccount, clientUniqueId]
    );
  };

  // 懸浮視窗Modal
  // 顯示帳號資訊
  const AccountInfoModal = (user_account) => {
    setFilterPersonInfo(
      accountInfo.filter((item) => item.client_account == user_account)
    );
  };

  const VideoInfoModal = (user_video) => {
    setFilterVideoInfo(
      accountInfo.filter((item) => item.client_account == user_video)
    );
  };

  const handleCloseAccountModal = () => {
    setFilterPersonInfo(null);
  };

  const handleCloseVidoeModal = () => {
    setFilterVideoInfo(null);
  };

  // 表格標題
  const AccountTitle = () => {
    return (
      <tr>
        <th>
          <input
            type="checkbox"
            onChange={() => {
              handleSelectAllVideo();
            }}
            checked={isCheckAllAccount}
          />
        </th>
        <th>帳號</th>
        <th>姓名</th>
        <th>狀態</th>
        <th>資訊</th>
      </tr>
    );
  };
  // 表格內容
  const AccountInfo = ({
    client_unique_id,
    client_name,
    client_account,
    client_is_lock,
    client_have_video,
  }) => {
    return (
      <tr>
        <td>
          <input
            type="checkbox"
            // checked client by client account
            checked={selectAccount.includes(client_unique_id)}
            onChange={() => {
              handleSelectAccount(client_unique_id);
            }}
            value={client_unique_id}
          />
        </td>
        <td>{client_account}</td>
        <td>{handleNameAccount(client_name)}</td>
        <td>
          <ShowLockIcon
            placement="bottom"
            islock={client_is_lock}
            tooltipText={client_is_lock ? "鎖定中" : "開放使用中"}
          />
          <ShowVideoIcon
            placement="bottom"
            haveVideo={client_have_video.length > 0 ? 1 : 0}
            tooltipText={client_have_video.length === 0 ? "無影片" : "有影片"}
          />
        </td>
        <td>
          <ShowInfoIcon
            placement="bottom"
            btnAriaLabel="帳號資訊"
            btnOnclickEventName={() => {
              AccountInfoModal(client_account);
            }}
            btnSize="sm"
            tooltipText="帳號資訊"
          />
          <ShowInfoIcon
            placement="bottom"
            btnAriaLabel="勾選影片資訊"
            btnOnclickEventName={() => {
              VideoInfoModal(client_account);
            }}
            btnSize="sm"
            tooltipText="勾選影片資訊"
            isInfoOrVideo="video"
          />
        </td>
      </tr>
    );
  };

  if (loading) {
    return <LoadingComponent title="帳號資訊欄位" text="帳號資訊載入中" />;
  }

  if (errorMessage) {
    return (
      <ErrorMessageComponent title="帳號資訊欄位" errorMessage={errorMessage} />
    );
  }

  return (
    <div className="container pb-4">
      <h1 className="mt-2 mb-2 fw-bold">帳號資訊欄位</h1>
      <Navbar bg="light" variant="light">
        <Container>
          <div className="me-auto">
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="批次新增"
              btnOnclickEventName={handleMultiAddAccount}
              btnText={
                <i
                  className="bi bi-person-plus-fill"
                  style={{ fontSize: 1.2 + "rem", color: "green" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="批次新增帳號"
            />
            {powerDiscription === "Admin" && (
              <ToolTipBtn
                placement="bottom"
                btnAriaLabel="刪除帳號"
                btnDisabled={isDisableDeleteBtn}
                btnOnclickEventName={() => {
                  if (selectAccount.length === 0) {
                    setIsDisableDeleteBtn(true);
                    toast.error("請選擇要刪除的帳號", {
                      autoClose: 1500,
                    });
                    setTimeout(() => {
                      setIsDisableDeleteBtn(false);
                    }, 2000);
                  } else {
                    setShowDeleteModal(true);
                  }
                }}
                btnText={
                  <i
                    className="bi bi-person-x-fill"
                    style={{ fontSize: 1.2 + "rem", color: "red" }}
                  ></i>
                }
                btnVariant="light"
                tooltipText="刪除帳號"
              />
            )}

            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="批次新增帳號影片"
              btnOnclickEventName={() => {
                if (selectAccount.length === 0) {
                  setIsDisableMultiAddBtn(true);
                  toast.error("請選擇要新增影片的帳號", {
                    autoClose: 1000,
                  });
                  setTimeout(() => {
                    setIsDisableMultiAddBtn(false);
                  }, 1000);
                } else {
                  handleMultiAddVideo();
                }
              }}
              btnText={
                <i
                  className="bi bi-pencil-fill"
                  style={{ fontSize: 1.2 + "rem", color: "blue" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="批次新增帳號影片"
            />
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="解鎖帳號"
              btnDisabled={isDisableUnlockBtn}
              btnOnclickEventName={() => {
                if (selectAccount.length === 0) {
                  setIsDisableUnlockBtn(true);
                  toast.error("請選擇要解鎖的帳號", {
                    autoClose: 1500,
                  });
                  setTimeout(() => {
                    setIsDisableUnlockBtn(false);
                  }, 2000);
                } else {
                  handleUnlockAccount();
                }
              }}
              btnText={
                <i
                  className="bi bi-unlock-fill"
                  style={{ fontSize: 1.2 + "rem" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="解鎖帳號"
            />

            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="回收桶"
              btnOnclickEventName={handleRestoreAccount}
              btnText={
                <i
                  className="bi bi-recycle"
                  style={{ fontSize: 1.2 + "rem" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="回收桶"
            />
          </div>

          <div className="d-flex">
            <Form.Control
              type="text"
              placeholder="搜尋"
              onChange={(event) => {
                setSearchInfo(event.target.value);
              }}
              // remove input focus border outline
              style={{ boxShadow: "none", outline: "none", border: "none" }}
            />
          </div>
        </Container>
      </Navbar>
      <Container className="mt-2">
        <Row>
          <Col md={3}>
            <Form.Select
              aria-label="請選擇用戶影片狀態"
              className={styles.container_selectbar}
              onChange={(event) => {
                setUserVideo(Number(event.target.value));
              }}
            >
              {CustomVideo.map((item, _) => {
                return (
                  <option key={item.id} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              aria-label="請選擇用戶帳號狀態"
              className={styles.container_selectbar}
              onChange={(event) => {
                setUserState(Number(event.target.value));
              }}
            >
              {CustomState.map((item, _) => {
                return (
                  <option key={item.id} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
          <Col md={{ span: 4, offset: 2 }}>
            <Form.Select
              aria-label="請選擇每頁資料筆數"
              onChange={(e) => {
                setPaginationSettings({
                  ...paginationSettings,
                  rowsPerPageAccount: Number(e.target.value),
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
      </Container>
      <div className="d-flex flex-row-reverse m-2"></div>
      <div className={`mt-3 mb-3`}>
        {filteraccountInfo.length !== 0 && (
          <Table>
            <thead>
              <AccountTitle />
            </thead>
            <tbody>
              {filteraccountInfo.map((item, index) => {
                return <AccountInfo key={index} {...item} />;
              })}
            </tbody>
          </Table>
        )}
        {filteraccountInfo.length === 0 && (
          <div className={`mt-3 mb-3`}>
            <h2 className="text-center p-2">該區段查無資料，請重新嘗試</h2>
          </div>
        )}
        <ReactPaginate
          forcePage={paginationSettings.currentPageAccount}
          breakLabel={"..."}
          nextLabel={">"}
          previousLabel={"<"}
          onPageChange={(page) => handlePageChange(page.selected, false)}
          pageCount={paginationSettings.lastPageAccount}
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
        {/* 用戶資訊Modal */}
        <Modal show={filterPersonInfo != null} onHide={handleCloseAccountModal}>
          <Modal.Header closeButton>
            <Modal.Title>帳號資訊</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {filterPersonInfo != null && (
              <div>
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="formPlaintextAccount"
                >
                  <Form.Label column sm="3">
                    帳號：
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue={filterPersonInfo[0].client_account}
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="AccountModalForm.usrPWD"
                >
                  <Form.Label column>密碼：</Form.Label>
                  <Col sm="9">
                    <Form.Control
                      type="password"
                      placeholder="請在此處輸入修改用戶密碼"
                      disabled={false}
                      ref={userPwd}
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="AccountModalForm.ControlInput1"
                >
                  <Form.Label column>姓名：</Form.Label>
                  <Col sm="9">
                    <Form.Control
                      type="text"
                      placeholder={`${filterPersonInfo[0].client_name}`}
                      disabled={false}
                      ref={userName}
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="AccountModalForm.ControlInput2"
                >
                  <Form.Label column>聯絡信箱：</Form.Label>
                  <Col sm="9">
                    <Form.Control
                      type="email"
                      placeholder={`${filterPersonInfo[0].client_email}`}
                      ref={userEmail}
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="formPlaintextLoginTimes"
                >
                  <Form.Label column sm="3">
                    登入次數：
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue={filterPersonInfo[0].client_login_times}
                    />
                  </Col>
                </Form.Group>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <BtnBootstrap
              variant="secondary"
              btnSize="normal"
              onClickEventName={handleCloseAccountModal}
              text={"關閉"}
            />
            <BtnBootstrap
              variant="primary"
              btnSize="normal"
              text={"修改"}
              disabled={isDisableEditProfileBtn}
              onClickEventName={() => {
                if (
                  userName.current.value == "" &&
                  userEmail.current.value == "" &&
                  userPwd.current.value == ""
                ) {
                  setIsDisableEditProfileBtn(true);
                  toast.error("請輸入修改資料", {
                    position: "top-center",
                    autoClose: 2000,
                  });
                  setTimeout(() => {
                    setIsDisableEditProfileBtn(false);
                  }, 3000);
                } else {
                  handleEditAccount(filterPersonInfo[0].client_unique_id);
                }
              }}
            />
          </Modal.Footer>
        </Modal>
        {/* 用戶影片資訊Modal */}
        <Modal show={filterVideoInfo != null} onHide={handleCloseVidoeModal}>
          <Modal.Header closeButton>
            <Modal.Title>影片資訊</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {filterVideoInfo != null && (
              <Container>
                <Row>
                  <Col>姓名：{filterVideoInfo[0].client_name}</Col>
                </Row>
                <Row className="mb-2">
                  <Col>已勾選影片：</Col>
                </Row>
                <ListGroup as="ol" numbered>
                  {filterVideoInfo[0].client_has_check_video.map(
                    (videoIndex, index) => {
                      const { video_type, video_name } =
                        videoData.find((item) => item.id === videoIndex) || {};
                      return (
                        <ListGroup.Item as="li" key={index}>
                          <b
                            className={
                              video_type === 2
                                ? "text-success"
                                : video_type === 1
                                ? "text-danger"
                                : "text-primary"
                            }
                          >
                            ({convertType(video_type)})
                          </b>
                          {video_name || "無影片"}
                        </ListGroup.Item>
                      );
                    }
                  )}
                </ListGroup>
                <Row className="mt-2">
                  <BtnBootstrap
                    variant="outline-primary"
                    btnSize="normal"
                    text={"點擊增/減影片"}
                    onClickEventName={() => {
                      setTempCheckedVideo(
                        filterVideoInfo[0].client_has_check_video
                      );
                      handleShowProfileVideoModal();
                    }}
                  />
                </Row>
              </Container>
            )}
          </Modal.Body>
          <Modal.Footer>
            <BtnBootstrap
              variant="secondary"
              btnSize="normal"
              onClickEventName={handleCloseVidoeModal}
              text={"關閉"}
            />
            <BtnBootstrap
              variant="primary"
              btnSize="normal"
              text={"修改影片資料"}
              disabled={isDisableEditProfileBtn}
              onClickEventName={() => {
                fetchUpdateUserVideo({
                  api: `video/update/client`,
                  data: {
                    clientID: filterVideoInfo[0].client_unique_video_id,
                    videoID: filterVideoInfo[0].client_has_check_video,
                  },
                });
              }}
            />
          </Modal.Footer>
        </Modal>

        {/* 影片類新增Modal */}
        <Modal
          show={showProfileVideoModal}
          onHide={() => {
            setTempCheckedVideo([]);
            handleClosedProfileVideoModal();
          }}
        >
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
                        rowsPerPageVideo: Number(e.target.value),
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
                                      item.video_type === 2
                                        ? "text-success"
                                        : item.video_type === 1
                                        ? "text-danger"
                                        : "text-primary"
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
                          setTempCheckedVideo(
                            tempCheckedVideo.includes(item.id)
                              ? tempCheckedVideo.filter(
                                  (video) => video !== item.id
                                )
                              : [...tempCheckedVideo, item.id]
                          );
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
                  onPageChange={(page) => handlePageChange(page.selected, true)}
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
              onClickEventName={() => {
                setTempCheckedVideo([]);
                handleClosedProfileVideoModal();
              }}
            />
            <BtnBootstrap
              btnSize="md"
              variant="outline-primary"
              text={"確認"}
              onClickEventName={() => {
                setFilterVideoInfo((prev) => {
                  return prev.map((item) => {
                    return {
                      ...item,
                      client_has_check_video: tempCheckedVideo,
                    };
                  });
                });
                setTempCheckedVideo([]);
                handleClosedProfileVideoModal();
              }}
            />
          </Modal.Footer>
        </Modal>

        {/* 確認刪除至回收桶Modal */}
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>請確認是否刪除</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>刪除後請至回收桶復原</p>
            <p>請留意!回收桶之檔案若超過3個月會自動清除</p>
          </Modal.Body>
          <Modal.Footer>
            <BtnBootstrap
              variant="secondary"
              onClickEventName={handleCloseDeleteModal}
              text="取消"
            />
            <BtnBootstrap
              variant="primary"
              onClickEventName={handleDeleteVideo}
              text="確認"
            />
          </Modal.Footer>
        </Modal>
      </div>
      <ToastAlert />
    </div>
  );
}
