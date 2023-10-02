import React, { useEffect, useState } from "react";
import ToolTipBtn from "../../components/ToolTipBtn";
import {
  Col,
  Container,
  Form,
  Modal,
  Navbar,
  Row,
  Table,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import LoadingComponent from "../../components/LoadingComponent";
import ErrorMessageComponent from "../../components/ErrorMessageComponent";
import FilterPageSize from "../JsonFile/FilterPageContentSize.json";
import ShowInfoIcon from "../../components/ShowInfoIcon";
import { del, get } from "../axios";
import BtnBootstrap from "../../components/BtnBootstrap";
import useModal from "../../hooks/useModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const convertUserPower = (power) => {
  const powerList = {
    0: "一般",
    1: "最高",
  };
  return powerList[power];
};

export default function ManageAdminAccount() {
  const { name, token, email, powerDiscription } = JSON.parse(
    localStorage?.getItem("manage") || sessionStorage?.getItem("manage") || "{}"
  );

  const navigate = useNavigate();

  const [initialState, setInitialState] = useState({
    accountInfo: [],
    deleteaccountInfo: [],
    errorMessage: "",
    filteraccountInfo: [],
    loading: true,
    paginationSettings: {
      currentPageAccount: 0,
      lastPageAccount: 1,
      rowsPerPageAccount: 5,
    },
    searchInfo: "",
    searchaccountInfo: [],
  });

  const {
    accountInfo,
    deleteaccountInfo,
    errorMessage,
    filteraccountInfo,
    loading,
    paginationSettings,
    searchInfo,
    searchaccountInfo,
  } = initialState;

  const { currentPageAccount, rowsPerPageAccount, lastPageAccount } =
    paginationSettings;

  const [showDeleteModal, handleCloseDeleteModal, handleShowDeleteModal] =
    useModal();

  // 初始化載入管理者帳號資訊
  const fetchManageAccountInfo = async ({ api }) => {
    try {
      const { data } = await get(api);
      const convertData = Array.isArray(data.data) ? data.data : [data.data];
      setInitialState({
        ...initialState,
        loading: false,
        accountInfo: convertData,
        filteraccountInfo: convertData.slice(
          0,
          paginationSettings.rowsPerPageAccount
        ),
        paginationSettings: {
          ...paginationSettings,
          lastPageAccount: Math.ceil(
            convertData.length / paginationSettings.rowsPerPageAccount
          ),
        },
      });
    } catch (error) {
      const { message } = error.response.data;
      setInitialState({
        ...initialState,
        loading: false,
        errorMessage: message,
      });
    }
  };

  // 刪除管理者帳號
  const deleteManageAccount = async ({ api }) => {
    const toastDeleteID = toast.loading("刪除中...");
    try {
      const { data } = await del(api);
      toast.update(toastDeleteID, {
        render: "刪除成功，將重新整理頁面",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      handleCloseDeleteModal();

      setTimeout(() => {
        navigate(0);
      }, 2000);
    } catch (error) {
      const { message } = error.response.data;
      if (message === "登入逾時，請重新登入" || message === "請重新登入") {
        toast.update(toastDeleteID, {
          render: message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        handleSessionTimeout();
      }

      toast.update(toastDeleteID, {
        render: "刪除失敗，請稍後再試",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      handleCloseDeleteModal();
    }
  };

  // 第一次載入管理者帳號資訊
  useEffect(() => {
    let ignore = false;
    const fetchDataAsync = async () => {
      await fetchManageAccountInfo({
        api: `admin/${powerDiscription}`,
      });
    };
    if (!ignore) {
      fetchDataAsync();
    }
    return () => {
      ignore = true;
    };
  }, [powerDiscription]);
  // 頁面發生改變事件
  const handlePageChange = (page) => {
    const start = page * rowsPerPageAccount;
    const end = start + Number(rowsPerPageAccount);

    setInitialState({
      ...initialState,
      filteraccountInfo: searchaccountInfo.slice(start, end),
      paginationSettings: {
        ...paginationSettings,
        currentPageAccount: page.selected,
      },
    });
  };

  const handleDeleteAccount = () => {
    deleteManageAccount({
      api: `admin/${token}/${deleteaccountInfo}`,
    });
  };

  const handleSessionTimeout = () => {
    if (sessionStorage.getItem("manage")) sessionStorage.removeItem("manage");
    if (localStorage.getItem("manage")) localStorage.removeItem("manage");
    navigate("/");
  };

  useEffect(() => {
    const data = accountInfo.filter((item) => {
      return (
        item.admin_name.includes(searchInfo) ||
        item.admin_account.includes(searchInfo) ||
        item.admin_email.includes(searchInfo)
      );
    });

    setInitialState({
      ...initialState,
      filteraccountInfo: data.slice(0, Number(rowsPerPageAccount)),
      searchaccountInfo: data,
      paginationSettings: {
        ...paginationSettings,
        currentPageAccount: 0,
        lastPageAccount: Math.ceil(data.length / rowsPerPageAccount),
      },
    });
  }, [rowsPerPageAccount, searchInfo]);

  // 表格標題
  const AccountTitle = () => {
    return (
      <tr>
        <th>名稱</th>
        <th>權限</th>
        <th>操作</th>
      </tr>
    );
  };
  // 表格內容
  const AccountInfo = ({
    admin_unique_id,
    admin_name,
    admin_account,
    admin_power,
    admin_email,
  }) => {
    return (
      <tr>
        <td>{admin_name}</td>
        <td className={admin_power === 1 ? "text-primary" : "text-danger"}>
          {convertUserPower(admin_power)}
        </td>
        <td>
          <ToolTipBtn
            placement="bottom"
            btnAriaLabel="帳號資訊"
            //   btnDisabled={isDisableDeleteBtn}
            btnOnclickEventName={() => {}}
            btnText={
              <i
                className="bi bi-info-lg"
                style={{ fontSize: 1.2 + "rem", color: "blue" }}
              ></i>
            }
            btnVariant="light"
            tooltipText="帳號資訊"
          />
          {name !== admin_name && (
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="刪除帳號"
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
              tooltipText="刪除帳號"
            />
          )}
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
    <Container className="pb-4">
      <h1 className="mt-2 mb-2 fw-bold">帳號資訊欄位</h1>
      <Navbar bg="light" variant="light">
        <Container>
          <div className="me-auto">
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="批次新增"
              //   btnOnclickEventName={}
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
              btnAriaLabel="回收桶"
              btnOnclickEventName={() => {}}
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
                setInitialState({
                  ...initialState,
                  searchInfo: event.target.value,
                });
              }}
              // remove input focus border outline
              style={{ boxShadow: "none", outline: "none", border: "none" }}
            />
          </div>
        </Container>
      </Navbar>
      <Container className="mt-2">
        <Row>
          <Col>
            <Form.Select
              aria-label="請選擇每頁資料筆數"
              onChange={(e) => {
                setInitialState({
                  ...initialState,
                  paginationSettings: {
                    ...paginationSettings,
                    rowsPerPageAccount: Number(e.target.value),
                  },
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
          forcePage={currentPageAccount}
          breakLabel={"..."}
          nextLabel={">"}
          previousLabel={"<"}
          onPageChange={(page) => {
            handlePageChange(Number(page.selected));
          }}
          pageCount={lastPageAccount}
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
      </div>
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
            onClickEventName={handleDeleteAccount}
            text="確認"
          />
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
