import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navbar, Container, Form, Table, Modal } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import moment from "moment/moment";
import { del, get, post } from "../axios";
import ToolTipBtn from "../../components/ToolTipBtn";
import LoadingComponent from "../../components/LoadingComponent";
import styles from "../../styles/pages/HomePage.module.scss";
import ToastAlert from "../../components/ToastAlert";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useModal from "../../hooks/useModal";
import BtnBootstrap from "../../components/BtnBootstrap";

export default function RestoreAdminAccount() {
  const { token } = JSON.parse(
    localStorage?.getItem("manage") || sessionStorage?.getItem("manage") || "{}"
  );

  const navigate = useNavigate();

  const [initialState, setInitialState] = useState({
    deleteaccountInfo: "",
    errorMessage: "",
    filterRestoreAccount: [],
    loading: true,
    pageniation: {
      currentPage: 0,
      lastPage: 1,
      rowsPerPage: 10,
    },
    restoreAccount: [],
    searchInfo: "",
    selectRestoreAccount: [],
    showData: [],
  });

  const {
    deleteaccountInfo,
    filterRestoreAccount,
    loading,
    pageniation,
    restoreAccount,
    searchInfo,
    selectRestoreAccount,
    showData,
  } = initialState;

  const [showDeleteModal, handleCloseDeleteModal, handleShowDeleteModal] =
    useModal();

  // 復原帳號
  const handleRestoreAccount = () => {
    fetchRestoreData({
      api: `admin/${token}/restore`,
      data: {
        selectRestoreAccount,
      },
    });
  };

  const handleDeleteAccount = () => {
    fetchPermanentDeleteData({
      api: `admin/${token}/${deleteaccountInfo}/permanently`,
    });
  };

  useEffect(() => {
    let ignore = false;

    const fetchDataAsync = async () => {
      await fetchaAccountData({
        api: "admins/deleted",
      });
    };

    if (!ignore) {
      fetchDataAsync();
    }
    return () => {
      ignore = true;
    };
  }, []);

  // 取得回收桶內帳號資訊API
  const fetchaAccountData = async ({ api }) => {
    try {
      const response = await get(api);
      const data = await response.data.data;
      const convertData = Array.isArray(data) ? data : [data];

      setInitialState({
        ...initialState,
        restoreAccount: convertData,
        filterRestoreAccount: convertData,
        loading: false,
        errorMessage: "",
      });
    } catch (error) {
      if (error.response?.data?.message === "登入逾時，請重新登入") {
        alert("登入逾時，請重新登入");
        handleSessionTimeout();
      } else {
        setInitialState({
          ...initialState,
          errorMessage: error.response?.data?.message,
          loading: false,
        });
      }
    }
  };

  // 復原帳號API
  const fetchRestoreData = async ({ api, data }) => {
    const id = toast.loading("復原帳號中，請稍後...");
    try {
      const response = await post(api, data);

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
      if (error.response?.data?.message === "登入逾時，請重新登入") {
        alert("登入逾時，請重新登入");
        handleSessionTimeout();
      }
      console.log(error.response);
      toast.update(id, {
        render: "伺服器發生錯誤，請重新操作",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  // 永久刪除帳號API
  const fetchPermanentDeleteData = async ({ api }) => {
    const id = toast.loading("刪除帳號中，請稍後...");
    try {
      const response = await del(api);

      toast.update(id, {
        render: "刪除帳號成功，即將重新載入頁面",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate(0);
      }, 2000);
    } catch (error) {
      if (error.response?.data?.message === "登入逾時，請重新登入") {
        alert("登入逾時，請重新登入");
        handleSessionTimeout();
      }
      console.log(error.response);
      toast.update(id, {
        render: "伺服器發生錯誤，請重新操作",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  // 登入逾時處理
  const handleSessionTimeout = () => {
    if (sessionStorage.getItem("manage")) sessionStorage.removeItem("manage");
    if (localStorage.getItem("manage")) localStorage.removeItem("manage");
    navigate("/");
  };

  const filterAccount = useCallback(
    (data) =>
      searchInfo !== ""
        ? data.filter(
            (item) =>
              item.admin_account.includes(searchInfo) ||
              item.admin_name.includes(searchInfo)
          )
        : data,
    [searchInfo]
  );

  const filterAccountData = useMemo(() => {
    return filterAccount(restoreAccount);
  }, [restoreAccount, filterAccount]);

  const { rowsPerPage } = pageniation;

  useEffect(() => {
    console.log(filterAccountData);

    const totalPage = Math.ceil(filterAccountData.length / rowsPerPage);

    setInitialState({
      ...initialState,
      filterRestoreAccount: filterAccountData,
      showData: filterAccountData.slice(0, rowsPerPage),
      pageniation: {
        ...pageniation,
        lastPage: totalPage,
        currentPage: 0,
      },
    });
  }, [filterAccountData, rowsPerPage]);

  const handlePageChange = (page) => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;

    setInitialState({
      ...initialState,
      showData: filterAccountData.slice(start, end),
      pageniation: {
        ...pageniation,
        currentPage: page,
      },
    });
  };

  // 單一選擇帳號
  const handleSelectRestoreAccount = (adminID) => {
    setInitialState({
      ...initialState,
      selectRestoreAccount: selectRestoreAccount.includes(adminID)
        ? selectRestoreAccount.filter((item) => item !== adminID)
        : [...selectRestoreAccount, adminID],
    });
  };
  // 表格標題
  const AccountTitle = () => {
    return (
      <tr>
        <th
          className={styles.container_division_table_rowTable_headingCheckBox}
        ></th>
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
        <th className={styles.container_division_table_rowTable_headingName}>
          操作
        </th>
      </tr>
    );
  };

  const AccountInfo = ({
    admin_unique_id,
    admin_name,
    admin_account,
    deleted_at,
  }) => {
    return (
      <tr>
        <td className={styles.container_division_table_rowTable_data}>
          <input
            type="checkbox"
            // checked client by client account
            checked={selectRestoreAccount.includes(admin_unique_id)}
            onChange={() => {
              handleSelectRestoreAccount(admin_unique_id);
            }}
            value={admin_unique_id}
            className={styles.container_division_table_rowTable_data_checkbox}
          />
        </td>
        <td className={styles.container_division_table_rowTable_data}>
          {admin_account}
        </td>
        <td className={styles.container_division_table_rowTable_data}>
          {admin_name}
        </td>
        <td className={styles.container_division_table_rowTable_data}>
          {moment(deleted_at).format("YYYY-MM-DD HH:mm:ss")}
        </td>
        <td className={styles.container_division_table_rowTable_data}>
          <ToolTipBtn
            placement="bottom"
            btnAriaLabel="永久刪除"
            btnOnclickEventName={() => {
              setInitialState({
                ...initialState,
                deleteaccountInfo: admin_unique_id,
              });
              handleShowDeleteModal();
            }}
            btnText={
              <i
                className="bi bi-person-x-fill"
                style={{ fontSize: 1.2 + "rem", color: "red" }}
              ></i>
            }
            btnVariant="light"
            tooltipText="永久刪除"
          />
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
                setInitialState({
                  ...initialState,
                  searchInfo: event.target.value,
                });
              }}
            />
          </div>
        </Container>
      </Navbar>
      {showData.length > 0 ? (
        <div>
          <Form.Select
            aria-label="請選擇每頁顯示筆數"
            className="float-end"
            style={{ width: "200px" }}
            onChange={(e) => {
              setInitialState({
                ...initialState,
                pageniation: {
                  ...pageniation,
                  rowsPerPage: Number(e.target.value),
                },
              });
            }}
          >
            <option value="10">每頁顯示10筆</option>
            <option value="50">每頁顯示50筆</option>
            <option value="100">每頁顯示100筆</option>
          </Form.Select>
        </div>
      ) : null}

      {showData.length > 0 ? (
        <div className={`mt-3 mb-3 ${styles.container_division}`}>
          <Table>
            <thead>
              <AccountTitle />
            </thead>
            <tbody>
              {showData.map((item, index) => {
                return <AccountInfo key={index} {...item} />;
              })}
            </tbody>
          </Table>
          <ReactPaginate
            breakLabel={"..."}
            nextLabel={">"}
            previousLabel={"<"}
            onPageChange={(page) => handlePageChange(Number(page.selected))}
            pageCount={pageniation.lastPage}
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
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>請確認是否刪除</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger fs-3">請留意！</p>
          <p className="text-danger fs-4">一旦進行永久刪除後，便無法復原</p>
        </Modal.Body>
        <Modal.Footer>
          <BtnBootstrap
            variant="secondary"
            onClickEventName={handleCloseDeleteModal}
            text="取消"
          />
          <BtnBootstrap
            variant="primary"
            onClickEventName={handleDeleteAccount}
            text="確認"
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
}
