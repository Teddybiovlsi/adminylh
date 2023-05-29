import React, { useEffect, useState } from "react";
import { get } from "../axios";
import { Container, Form, Modal, Navbar, Table } from "react-bootstrap";
import ToolTipBtn from "../../components/ToolTipBtn";
import ShowLockIcon from "../../components/ShowLockIcon";
import ShowInfoIcon from "../../components/ShowInfoIcon";
import CustomState from "../JsonFile/SelectCustomerState.json";
import { set } from "lodash";
import Loading from "../../components/Loading";
import LoadingComponent from "../../components/LoadingComponent";
import ErrorMessageComponent from "../../components/ErrorMessageComponent";
import styles from "../../styles/pages/HomePage.module.scss";
import { useNavigate } from "react-router-dom";

export default function ManageClientAccount() {
  const handleSelectAllAccount = () => {};
  const [accountInfo, setAccountInfo] = useState([]);

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
  // 用來儲存使用者傳入之Excel檔案
  const [sheetData, setSheetData] = useState([]);
  // 若帳號資訊尚未載入完成，則顯示Loading
  const [loading, setLoading] = useState(false);
  // 若帳號資訊載入失敗，則顯示錯誤訊息
  const [errorMessage, setErrorMessage] = useState("");
  // 若篩選後的資料為空，則顯示錯誤訊息
  const [errorFilterMessage, setErrorFilterMessage] = useState("");
  // 若沒有選擇任何帳號，則禁用編輯、解鎖、刪除按鈕
  const [isDisableEditBtn, setIsDisableEditBtn] = useState(true);
  const [isDisableUnlockBtn, setIsDisableUnlockBtn] = useState(true);
  const [isDisableDeleteBtn, setIsDisableDeleteBtn] = useState(true);

  // 以下是帳號資訊欄位上方功能列的選項
  // 批次新增帳號

  let navigate = useNavigate();
  const handleMultiAddAccount = () => {
    navigate("/MultiAddUser");
  };
  // 編輯帳號
  const handleEditAccount = () => {};
  // 解鎖帳號
  const handleUnlockAccount = () => {};
  // 刪除帳號
  const handleDeleteAccount = () => {};

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
      setFilteraccountInfo(
        accountInfo.filter((item) => item.client_is_lock == 0)
      );
    } else if (userState == 1) {
      setFilteraccountInfo(
        accountInfo.filter((item) => item.client_is_lock == 1)
      );
    } else {
      setFilteraccountInfo(accountInfo);
    }
  }, [userState]);
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
      // if catch error, clear videoData
      setVideoData([]);
      // setFilterVideoData([]);
      // 將 loading 設為 false
      setLoading(false);
      // if error.response is true, get error message
      if (error.response) {
        setErrorMessage(StatusCode(error.response.status));
      }
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
      setIsDisableUnlockBtn(true);
      setIsDisableDeleteBtn(true);
    } else {
      setIsDisableEditBtn(false);
      setIsDisableUnlockBtn(false);
      setIsDisableDeleteBtn(false);
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
      : setSelectAccount(filteraccountInfo.map((item) => item.client_account));
  };

  // 單一選擇帳號
  const handleSelectAccount = (account) => {
    setSelectAccount(
      selectAccount.includes(account)
        ? selectAccount.filter((item) => item !== account)
        : [...selectAccount, account]
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
        <th
          className={styles.container_division_table_rowTable_headingCheckBox}
        >
          <input
            type="checkbox"
            onChange={() => {
              handleSelectAllVideo();
            }}
            checked={isCheckAllAccount}
            className={
              styles.container_division_table_rowTable_heading_checkbox
            }
          />
        </th>
        <th className={styles.container_division_table_rowTable_headingType}>
          帳號
        </th>
        <th
          className={styles.container_division_table_rowTable_headingLanguage}
        >
          姓名
        </th>
        <th className={styles.container_division_table_rowTable_headingName}>
          狀態
        </th>
        <th className={styles.container_division_table_rowTable_headingName}>
          資訊
        </th>
      </tr>
    );
  };

  const AccountInfo = ({ client_name, client_account, client_is_lock }) => {
    return (
      <tr>
        <td className={styles.container_division_table_rowTable_data}>
          <input
            type="checkbox"
            // checked client by client account
            checked={selectAccount.includes(client_account)}
            onChange={() => {
              handleSelectAccount(client_account);
            }}
            value={client_account}
            className={styles.container_division_table_rowTable_data_checkbox}
          />
        </td>
        <td className={styles.container_division_table_rowTable_data}>
          {handleIdAccount(client_account)}
        </td>
        <td className={styles.container_division_table_rowTable_data}>
          {handleNameAccount(client_name)}
        </td>
        <td className={styles.container_division_table_rowTable_data}>
          <ShowLockIcon
            placement="bottom"
            islock={client_is_lock}
            tooltipText={client_is_lock === 0 ? "開放使用中" : "鎖定中"}
          />
        </td>
        <td className={styles.container_division_table_rowTable_data}>
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
      <h1 className={styles.container_firstHeading}>帳號資訊欄位</h1>
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
                  style={{ fontSize: 1.2 + "rem" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="批次新增帳號"
            />
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="編輯帳號"
              btnDisabled={isDisableEditBtn}
              // btnDisabled={
              // }
              // btnOnclickEventName={handleEditVideo}
              btnText={
                <i
                  className="bi bi-pencil-square"
                  style={{ fontSize: 1.2 + "rem" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="編輯帳號"
            />
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="解鎖帳號"
              btnDisabled={isDisableUnlockBtn}
              // btnDisabled={
              // }
              // btnOnclickEventName={handleEditVideo}
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
              btnAriaLabel="刪除帳號"
              btnDisabled={isDisableDeleteBtn}
              // btnDisabled={
              // }
              // btnOnclickEventName={() => {

              // }}
              btnText={
                <i
                  className="bi bi-trash3-fill"
                  style={{ fontSize: 1.2 + "rem" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="刪除帳號"
            />
          </div>
          <div className="d-flex">
            <Form.Control
              type="text"
              placeholder="搜尋"
              onChange={(event) => {
                setSearchInfo(event.target.value);
              }}
            />
          </div>
        </Container>
      </Navbar>
      <div>
        <Form.Select
          aria-label="請選擇用戶狀態"
          onChange={(event) => {
            setUserState(event.target.value);
          }}
          style={{ width: "200px" }}
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
      <div className={`mt-3 mb-3 ${styles.container_division}`}>
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
          <div className={`mt-3 mb-3 ${styles.container_division}`}>
            <h2 className={styles.container_division_secondHeading}>
              {errorFilterMessage}
            </h2>
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
      </div>
    </div>
  );
}
