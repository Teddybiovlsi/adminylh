import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { get, del, put } from "../axios";
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
import ToolTipBtn from "../../components/ToolTipBtn";
import ShowLockIcon from "../../components/ShowLockIcon";
import ShowInfoIcon from "../../components/ShowInfoIcon";
import ShowVideoIcon from "../../components/ShowVideoIcon";
import CustomState from "../JsonFile/SelectCustomerState.json";
import CustomVideo from "../JsonFile/SelectCustomerVideo.json";
import Loading from "../../components/Loading";
import LoadingComponent from "../../components/LoadingComponent";
import ErrorMessageComponent from "../../components/ErrorMessageComponent";
import { useNavigate, Navigate } from "react-router-dom";
import BtnBootstrap from "../../components/BtnBootstrap";
import { toast } from "react-toastify";
import ToastAlert from "../../components/ToastAlert";
import styles from "../../styles/pages/ManageClientAccount.module.scss";
import { List } from "react-bootstrap-icons";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import useModal from "../../hooks/useModal";

import FilterPageSize from "../JsonFile/FilterPageContentSize.json";
import FilterType from "../JsonFile/FilterVideoType.json";
import convertType from "../../functions/typeConverter";

export default function ManageClientAccount() {
  // 用來儲存修改姓名的資料
  const userName = useRef(null);
  // 用來儲存修改聯絡信箱的資料
  const userEmail = useRef(null);
  // 用來儲存修改密碼的資料
  const userPwd = useRef(null);

  const user = JSON.parse(
    localStorage?.getItem("manage") || sessionStorage?.getItem("manage")
  );

  const [accountInfo, setAccountInfo] = useState([]);
  // 用來儲存搜尋欄位的資料
  const [searchInfo, setSearchInfo] = useState("");

  const [videoData, setVideoData] = useState([]);

  const [searchVideoResult, setSearchVideoResult] = useState([]);

  // 用來儲存篩選後的資料
  const [filteraccountInfo, setFilteraccountInfo] = useState([]);
  // 用來儲存篩選後的資料，用於懸浮視窗Modal
  const [filterPersonInfo, setFilterPersonInfo] = useState(null);
  // 用來儲存篩選後的使用者影片資料，用於懸浮視窗Modal
  const [filterVideoInfo, setFilterVideoInfo] = useState(null);

  const [searchTextVideo, setSearchTextVideo] = useState("");

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
  // 若篩選後的資料為空，則顯示錯誤訊息
  const [errorFilterMessage, setErrorFilterMessage] = useState("");
  // 若沒有選擇任何帳號，則禁用編輯、解鎖、刪除按鈕
  const [isDisableMultiAddBtn, setIsDisableMultiAddBtn] = useState(false);
  const [isDisableEditBtn, setIsDisableEditBtn] = useState(false);
  const [isDisableUnlockBtn, setIsDisableUnlockBtn] = useState(false);
  const [isDisableDeleteBtn, setIsDisableDeleteBtn] = useState(false);
  const [isDisableEditProfileBtn, setIsDisableEditProfileBtn] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const [showVideoModal, handleClosedVideoModal, handleShowVideoModal] =
    useModal();

  const handleDeleteVideo = () => {
    // put selectAccount value into an array
    const data = [selectAccount];
    // put data array into a hyperlink
    const api = `client/${data}`;
    // call fetchDeleteVideo function
    fetchDeleteAccount({ api });
    // close delete modal
    setShowDeleteModal(false);
    // clear selectAccount
    setSelectAccount([]);
    // clear accountInfo
    setAccountInfo([]);
    // clear filteraccountInfo
    setFilteraccountInfo([]);
    // setLoading to true
    setLoading(true);
    // call fetchaAccountData function to reload account data
    // 設置3秒才重新載入資料，避免資料未在資料庫更新時就重新載入資料
    setTimeout(() => {
      fetchData({
        api: "account",
        setData: setAccountInfo,
        setSearchResult: setFilteraccountInfo,
      });
    }, 3000);
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

    if (email == "" || name == "") {
      if (email == "") {
        const data = {
          clientName: name,
        };
        console.log(data);
        fetchUpdateUserProfile({ api: `client/${Clientid}`, data });
      } else {
        const data = {
          clientEmail: email,
        };
        fetchUpdateUserProfile({ api: `client/${Clientid}`, data });
      }
    } else if (email != "" && name != "") {
      const data = {
        clientName: name,
        clientEmail: email,
      };
      fetchUpdateUserProfile({ api: `client/${Clientid}`, data });
    }
  };
  // 解鎖帳號
  const handleUnlockAccount = () => {
    fetchUnlockAccount({
      api: `client/${[selectAccount]}/unlock`,
    });
    setTimeout(() => {
      // clear selectAccount
      setSelectAccount([]);
      // clear accountInfo
      setAccountInfo([]);
      // clear filteraccountInfo
      setFilteraccountInfo([]);
      // setLoading to true
      setLoading(true);
      // call fetchaAccountData function to reload account data
      // 設置3秒才重新載入資料，避免資料未在資料庫更新時就重新載入資料
      setTimeout(() => {
        fetchData({
          api: "account",
          setData: setAccountInfo,
          setSearchResult: setFilteraccountInfo,
        });
      }, 3000);
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

  const fetchData = async ({ api, setData, setSearchResult }) => {
    try {
      const response = await get(api);
      const data = await response.data.data;
      const checkIsArray = Array.isArray(data);
      setData(checkIsArray ? data : [data]);
      setSearchResult(checkIsArray ? data : [data]);
      setErrorMessage("");
      setLoading(false);
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

  // 用戶狀態(啟用/停用)改變時，重新選擇資料
  // useEffect(() => {
  //   const filteredData = accountInfo.filter((item) => {
  //     const isLockMatch =
  //       Number(userState) === 0
  //         ? item.client_is_lock == 0
  //         : item.client_is_lock == 1;
  //     const isVideoMatch =
  //       Number(userVideo) === 0
  //         ? item.client_have_video.length === 0
  //         : item.client_have_video.length > 0;

  //     console.log(isLockMatch, isVideoMatch);
  //     return isLockMatch && isVideoMatch;
  //   });
  //   console.log(filteredData);

  //   setFilteraccountInfo(filteredData);
  // }, [userState, userVideo]);

  const filterUserInfo = useCallback(
    (data) => {
      if (userState !== 2) {
        data = data.filter((item) => item.client_is_lock === userState);
      }

      if (userVideo !== 2) {
        data = data.filter((item) =>
          item.client_have_video.length > 0
            ? item.client_have_video.length > 0
            : item.client_have_video.length === 0
        );
        console.log(data);
      }

      return data;
    },
    [userState, userVideo]
  );

  const filteredAccountData = useMemo(
    () => filterUserInfo(accountInfo),
    [filterUserInfo, accountInfo]
  );

  // 當篩選後的資料長度為0時，顯示錯誤訊息
  useEffect(() => {
    if (filteraccountInfo.length == 0) {
      setErrorFilterMessage("該區段查無資料，請重新選擇");
    } else {
      setErrorFilterMessage("");
      // 在filteraccountInfo有所變動時，檢查是否長度一致，若一致則全選，反之則取消全選
      if (filteraccountInfo.length === selectAccount.length) {
        setIsCheckAllAccount(true);
      } else {
        setIsCheckAllAccount(false);
      }
    }
  }, [filteraccountInfo]);

  // 執行刪除帳號API
  const fetchDeleteAccount = async ({ api }) => {
    try {
      const response = await del(api);
      // get response from res.data.data
      // because res.data.data is a promise
      // so we need to use await to get the value of res.data.data
      // and then we can use data to get the value of res.data.data
      const data = await response.data.data;

      console.log(response);
    } catch (error) {
      if (error.response) {
        setErrorMessage(StatusCode(error.response.status));
      }
      console.log(error);
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

  // 將身分證敏感資訊做處理
  const handleIdAccount = (account) => {
    if (account.length === 10) {
      return account.slice(0, 3) + "***" + account.slice(6, 10);
    } else if (account.length === 11) {
      return account.slice(0, 3) + "***" + account.slice(7, 11);
    }
  };
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
  useEffect(() => {
    // 若搜尋欄位不為空，則顯示搜尋結果
    if (searchInfo !== "") {
      setFilteraccountInfo(
        accountInfo.filter((item) => {
          return (
            item.client_account.includes(searchInfo) ||
            item.client_name.includes(searchInfo)
          );
        })
      );
    } else {
      setFilteraccountInfo(accountInfo);
    }
  }, [searchInfo]);

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
        <td>{handleIdAccount(client_account)}</td>
        <td>{handleNameAccount(client_name)}</td>
        <td>
          <ShowLockIcon
            placement="bottom"
            islock={client_is_lock}
            tooltipText={client_is_lock ? "開放使用中" : "鎖定中"}
          />
          <ShowVideoIcon
            placement="bottom"
            haveVideo={!!client_have_video.length > 0 ? 1 : 0}
            tooltipText={client_have_video === 0 ? "無影片" : "有影片"}
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
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="批次新增帳號影片"
              btnOnclickEventName={() => {
                if (selectAccount.length === 0) {
                  setIsDisableMultiAddBtn(true);
                  toast.error("請選擇要新增影片的帳號", {
                    autoClose: 1500,
                  });
                  setTimeout(() => {
                    setIsDisableMultiAddBtn(false);
                  }, 2000);
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
      <div className="d-flex flex-row-reverse m-2">
        <Form.Select
          aria-label="請選擇用戶影片狀態"
          className={styles.container_selectbar}
          onChange={(event) => {
            setUserVideo(Number(event.target.value));
          }}
          style={{
            width: "220px",
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
        <Form.Select
          aria-label="請選擇用戶帳號狀態"
          className={styles.container_selectbar}
          onChange={(event) => {
            setUserState(Number(event.target.value));
          }}
          style={{ width: "220px" }}
        >
          {CustomState.map((item, _) => {
            return (
              <option key={item.id} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </Form.Select>
      </div>
      <div className={`mt-3 mb-3`}>
        {errorFilterMessage == "" && (
          <Table>
            <thead>
              <AccountTitle />
            </thead>
            <tbody>
              {filteredAccountData.map((item, index) => {
                return <AccountInfo key={index} {...item} />;
              })}
            </tbody>
          </Table>
        )}
        {errorFilterMessage != "" && (
          <div className={`mt-3 mb-3`}>
            <h2 className="text-center p-2">{errorFilterMessage}</h2>
          </div>
        )}
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
                  {filteraccountInfo[0].client_have_video.map(
                    (video, index) => {
                      return (
                        <ListGroup.Item as="li" key={index}>
                          {video.video_name}
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
                        filteraccountInfo[0].client_has_check_video
                      );
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

        {/* 影片類 */}
        <Modal
          show={tempCheckedVideo.length > 0}
          onHide={() => {
            setTempCheckedVideo([]);
            handleClosedVideoModal;
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
                  {videoData.map((item, index) => {
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
                  // forcePage={paginationSettings.currentPageVideo}
                  breakLabel={"..."}
                  nextLabel={">"}
                  previousLabel={"<"}
                  onPageChange={(page) =>
                    handlePageChange(page.selected, false)
                  }
                  // pageCount={paginationSettings.lastPageVideo}
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
                // handleConfirmCheckedItems("video", tempCheckedVideo);
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
