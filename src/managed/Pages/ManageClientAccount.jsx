import React, { useEffect, useState } from "react";
import { get, del } from "../axios";
import { Container, Form, Modal, Navbar, Table } from "react-bootstrap";
import ToolTipBtn from "../../components/ToolTipBtn";
import ShowLockIcon from "../../components/ShowLockIcon";
import ShowInfoIcon from "../../components/ShowInfoIcon";
import ShowVideoIcon from "../../components/ShowVideoIcon";
import CustomState from "../JsonFile/SelectCustomerState.json";
import CustomVideo from "../JsonFile/SelectCustomerVideo.json";
import { set } from "lodash";
import Loading from "../../components/Loading";
import LoadingComponent from "../../components/LoadingComponent";
import ErrorMessageComponent from "../../components/ErrorMessageComponent";
import { useNavigate, Navigate } from "react-router-dom";
import BtnBootstrap from "../../components/BtnBootstrap";
import { toast } from "react-toastify";
import ToastAlert from "../../components/ToastAlert";
import styles from "../../styles/pages/ManageClientAccount.module.scss";

export default function ManageClientAccount() {
  const [accountInfo, setAccountInfo] = useState([]);
  // 用來儲存搜尋欄位的資料
  const [searchInfo, setSearchInfo] = useState("");
  // 用來儲存篩選後的資料
  const [filteraccountInfo, setFilteraccountInfo] = useState([]);
  // 用來儲存篩選後的資料，用於懸浮視窗Modal
  const [filterPersonInfo, setFilterPersonInfo] = useState(null);
  // 用來儲存是否全選帳號
  const [isCheckAllAccount, setIsCheckAllAccount] = useState(false);
  // 用來儲存選擇的帳號
  const [selectAccount, setSelectAccount] = useState([]);
  // 用來儲存用戶狀態(正常使用中/鎖定中)
  const [userState, setUserState] = useState("");
  // 用來儲存用戶影片狀態(有影片/無影片)
  const [userVideo, setUserVideo] = useState("");
  // 若帳號資訊尚未載入完成，則顯示Loading
  const [loading, setLoading] = useState(false);
  // 若帳號資訊載入失敗，則顯示錯誤訊息
  const [errorMessage, setErrorMessage] = useState("");
  // 若篩選後的資料為空，則顯示錯誤訊息
  const [errorFilterMessage, setErrorFilterMessage] = useState("");
  // 若沒有選擇任何帳號，則禁用編輯、解鎖、刪除按鈕
  const [isDisableMultiAddBtn, setIsDisableMultiAddBtn] = useState(false);
  const [isDisableEditBtn, setIsDisableEditBtn] = useState(false);
  const [isDisableUnlockBtn, setIsDisableUnlockBtn] = useState(false);
  const [isDisableDeleteBtn, setIsDisableDeleteBtn] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

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
      fetchaAccountData({
        api: "account",
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
  const handleEditAccount = () => {};
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
        fetchaAccountData({
          api: "account",
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
    if (!ignore) {
      // set loading to true
      setLoading(true);
      fetchaAccountData({
        api: "account",
      });
    }
    return () => {
      ignore = true;
    };
  }, []);

  // 用戶狀態(啟用/停用)改變時，重新選擇資料
  useEffect(() => {
    if (userState == 0) {
      if (userVideo == 0) {
        setFilteraccountInfo(
          accountInfo.filter(
            (item) => item.client_is_lock == 0 && item.client_have_video == 0
          )
        );
      } else if (userVideo == 1) {
        setFilteraccountInfo(
          accountInfo.filter(
            (item) => item.client_is_lock == 0 && item.client_have_video == 1
          )
        );
      } else {
        setFilteraccountInfo(
          accountInfo.filter((item) => item.client_is_lock == 0)
        );
      }
    } else if (userState == 1) {
      if (userVideo == 0) {
        setFilteraccountInfo(
          accountInfo.filter(
            (item) => item.client_is_lock == 1 && item.client_have_video == 0
          )
        );
      } else if (userVideo == 1) {
        setFilteraccountInfo(
          accountInfo.filter(
            (item) => item.client_is_lock == 1 && item.client_have_video == 1
          )
        );
      } else {
        setFilteraccountInfo(
          accountInfo.filter((item) => item.client_is_lock == 1)
        );
      }
    } else if (userVideo == 0) {
      if (userState == 0) {
        setFilteraccountInfo(
          accountInfo.filter(
            (item) => item.client_is_lock == 0 && item.client_have_video == 0
          )
        );
      } else if (userState == 1) {
        setFilteraccountInfo(
          accountInfo.filter(
            (item) => item.client_is_lock == 1 && item.client_have_video == 0
          )
        );
      } else {
        setFilteraccountInfo(
          accountInfo.filter((item) => item.client_have_video == 0)
        );
      }
    } else if (userVideo == 1) {
      if (userState == 0) {
        setFilteraccountInfo(
          accountInfo.filter(
            (item) => item.client_is_lock == 0 && item.client_have_video == 1
          )
        );
      } else if (userState == 1) {
        setFilteraccountInfo(
          accountInfo.filter(
            (item) => item.client_is_lock == 1 && item.client_have_video == 1
          )
        );
      } else {
        setFilteraccountInfo(
          accountInfo.filter((item) => item.client_have_video == 1)
        );
      }
    } else {
      setFilteraccountInfo(accountInfo);
    }
  }, [userState, userVideo]);
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
      // 將預設篩選後的資料設為 data
      setFilteraccountInfo(checkIsArray ? data : [data]);
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
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {}
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

  const handleCloseAccountModal = () => setFilterPersonInfo(null);

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
            tooltipText={client_is_lock === 0 ? "開放使用中" : "鎖定中"}
          />
          <ShowVideoIcon
            placement="bottom"
            haveVideo={client_have_video}
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
                  className="bi bi-trash3-fill"
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
            setUserVideo(event.target.value);
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
            setUserState(event.target.value);
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
              {filteraccountInfo.map((item, index) => {
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
                <p>帳號：{filterPersonInfo[0].client_account}</p>
                <p>姓名：{filterPersonInfo[0].client_name}</p>
                <p>聯絡信箱：{filterPersonInfo[0].client_email}</p>
                <p>登入次數：{filterPersonInfo[0].client_login_times}</p>
              </div>
            )}
          </Modal.Body>
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
