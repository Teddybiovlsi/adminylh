import React, { useEffect, useState } from "react";
import { Navbar, Container, Form, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import moment from "moment/moment";
import { get } from "../axios";
import ToolTipBtn from "../../components/ToolTipBtn";
import LoadingComponent from "../../components/LoadingComponent";
import styles from "../../styles/pages/HomePage.module.scss";
import ToastAlert from "../../components/ToastAlert";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RestoreAccount() {
  const navigate = useNavigate();

  // 原始資料
  const [restoreAccount, setRestoreAccount] = useState([]);
  // 篩選資料
  const [filterRestoreAccount, setFilterRestoreAccount] = useState([]);
  // 搜尋資料
  const [searchInfo, setSearchInfo] = useState([]);
  // 載入中
  const [loading, setLoading] = useState(true);
  // 錯誤訊息
  const [errorMessage, setErrorMessage] = useState("");
  // 以下是勾選資料相關變數
  // 用來儲存是否全選帳號
  const [isCheckAllRestoreAccount, setIsCheckAllRestoreAccount] =
    useState(false);
  // 用來儲存選擇的帳號
  const [selectRestoreAccount, setSelectRestoreAccount] = useState([]);

  // 以下內容是篩選每頁顯示的資料筆數
  // 存放每頁顯示的資料筆數
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // 存放目前頁數
  const [currentPage, setCurrentPage] = useState(1);
  // 存放目前頁數的資料
  const [showData, setShowData] = useState(
    filterRestoreAccount.slice(0, rowsPerPage)
  );
  const [lastPage, setLastPage] = useState(1);

  // 復原帳號
  const handleRestoreAccount = () => {
    const selectId = [selectRestoreAccount];
    fetchRestoreData({
      api: `client/${selectId}/restore`,
    });
  };

  const fetchRestoreData = async ({ api }) => {
    const id = toast.loading("復原帳號中，請稍後...", {
      position: "top-right",
    });
    try {
      const response = await get(api);

      toast.update(id, {
        render: "復原帳號成功，即將重新載入頁面",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate(0);
      }, 2000);
    } catch (error) {
      toast.update(id, {
        render: "伺服器發生錯誤，請重新操作",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const fetchaAccountData = async ({ api }) => {
    try {
      const response = await get(api);
      const data = await response.data.data;
      const convertData = Array.isArray(data) ? data : [data];
      setRestoreAccount(convertData);
      // 同時也儲存一份資料給篩選用
      setFilterRestoreAccount(convertData);
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

  useEffect(() => {
    let ignore = false;

    const fetchDataAsync = async () => {
      await fetchaAccountData({
        api: "clients/deleted",
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
    // 若搜尋欄位不為空，則顯示搜尋結果
    if (searchInfo !== "") {
      setFilterRestoreAccount(
        restoreAccount.filter((item) => {
          return (
            item.client_account.includes(searchInfo) ||
            item.client_name.includes(searchInfo)
          );
        })
      );
    } else {
      setFilterRestoreAccount(restoreAccount);
    }
  }, [searchInfo]);

  // 當rowsPerPage改變時，重新計算最後一頁的頁數
  const handlePageChange = (page) => {
    setCurrentPage(page);
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setShowData(filterRestoreAccount.slice(start, end));
  };

  // 若帳號欄位全部被勾選，則全選按鈕勾選
  useEffect(() => {
    // 在初始render時，selectAccount為空陣列，也因為filteraccountInfo也為空陣列
    // filteraccountInfo.length > 0，則會導致isCheckAllAccount一直為true
    filterRestoreAccount.length > 0 &&
      (selectRestoreAccount.length === filterRestoreAccount.length
        ? setIsCheckAllRestoreAccount(true)
        : setIsCheckAllRestoreAccount(false));
    // 例外情形是，勾選的數量比篩選後的數量多，則全選按鈕不勾選
    selectRestoreAccount.length > filterRestoreAccount.length &&
      setIsCheckAllRestoreAccount(false);
  }, [selectRestoreAccount, filterRestoreAccount]);
  // 全選帳號
  const handleSelectAllRestoreAccount = () => {
    setIsCheckAllRestoreAccount(!isCheckAllRestoreAccount);

    isCheckAllRestoreAccount
      ? setSelectRestoreAccount([])
      : setSelectRestoreAccount(
          filterRestoreAccount.map((item) => item.client_unique_id)
        );
  };

  // 單一選擇帳號
  const handleSelectRestoreAccount = (clientUniqueId) => {
    setSelectRestoreAccount(
      selectRestoreAccount.includes(clientUniqueId)
        ? selectRestoreAccount.filter((item) => item !== clientUniqueId)
        : [...selectRestoreAccount, clientUniqueId]
    );
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
              handleSelectAllRestoreAccount();
            }}
            checked={isCheckAllRestoreAccount}
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
          刪除時間
        </th>
      </tr>
    );
  };

  const AccountInfo = ({
    client_unique_id,
    client_name,
    client_account,
    deleted_at,
  }) => {
    return (
      <tr>
        <td className={styles.container_division_table_rowTable_data}>
          <input
            type="checkbox"
            // checked client by client account
            checked={selectRestoreAccount.includes(client_unique_id)}
            onChange={() => {
              handleSelectRestoreAccount(client_unique_id);
            }}
            value={client_unique_id}
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
          {moment(deleted_at).format("YYYY-MM-DD HH:mm:ss")}
        </td>
      </tr>
    );
  };

  if (loading) {
    return <LoadingComponent title="回收桶" text="刪除之帳號資訊載入中" />;
  }

  return (
    <div className="container pb-4">
      <h1 className={styles.container_firstHeading}>回收桶</h1>
      <Navbar bg="light" variant="light">
        <Container>
          <div className="me-auto">
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="復原帳號"
              btnOnclickEventName={handleRestoreAccount}
              btnText={
                <i
                  className="bi bi-arrow-clockwise"
                  style={{ fontSize: 1.2 + "rem", color: "green" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="復原帳號"
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
      {filterRestoreAccount.length > 0 ? (
        <div>
          <Form.Select
            aria-label="請選擇每頁顯示筆數"
            className="float-end"
            style={{ width: "200px" }}
            onChange={(e) => {
              setRowsPerPage(e.target.value);
            }}
          >
            <option value="10">每頁顯示10筆</option>
            <option value="50">每頁顯示50筆</option>
            <option value="100">每頁顯示100筆</option>
          </Form.Select>
        </div>
      ) : null}

      {filterRestoreAccount.length > 0 ? (
        <div className={`mt-3 mb-3 ${styles.container_division}`}>
          <Table>
            <thead>
              <AccountTitle />
            </thead>
            <tbody>
              {filterRestoreAccount.map((item, index) => {
                return <AccountInfo key={index} {...item} />;
              })}
            </tbody>
          </Table>
          <ReactPaginate
            breakLabel={"..."}
            nextLabel={">"}
            previousLabel={"<"}
            onPageChange={(page) => handlePageChange(page.selected + 1)}
            pageCount={lastPage}
            pageRangeDisplayed={3}
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
        </div>
      ) : (
        <div className="text-center mt-3 mb-3">
          <h3>搜尋結果沒有任何帳號資訊</h3>
        </div>
      )}
      <ToastAlert />
    </div>
  );
}
