import React, { useEffect, useState } from "react";
import ToolTipBtn from "../../components/ToolTipBtn";
import { Col, Container, Form, Navbar, Row, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import LoadingComponent from "../../components/LoadingComponent";
import ErrorMessageComponent from "../../components/ErrorMessageComponent";
import FilterPageSize from "../JsonFile/FilterPageContentSize.json";
import { get } from "../axios";

export default function ManageAdminAccount() {
  const { token, email, powerDiscription } = JSON.parse(
    localStorage?.getItem("manage") || sessionStorage?.getItem("manage") || "{}"
  );

  const [initialState, setInitialState] = useState({
    loading: false,
    errorMessage: "",
    accountInfo: [],
    filteraccountInfo: [],
    searchInfo: "",
    paginationSettings: {
      currentPageAccount: 0,
      lastPageAccount: 1,
      rowsPerPageAccount: 5,
    },
    isCheckAllAccount: false,
    selectAccount: [],
    showDeleteModal: false,
    isDisableDeleteBtn: false,
    isDisableMultiAddBtn: false,
    isDisableUnlockBtn: false,
  });

  const {
    loading,
    paginationSettings,
    errorMessage,
    filteraccountInfo,
    accountInfo,
  } = initialState;

  const { currentPageAccount, lastPageAccount } = paginationSettings;

  // 初始化載入管理者帳號資訊
  const fetchManageAccountInfo = async ({ api }) => {
    try {
      const { data } = await get(api);
      const convertData = Array.isArray(data.data) ? data.data : [data.data];
      setInitialState({
        ...initialState,
        loading: false,
        accountInfo: convertData,
        filteraccountInfo: convertData,
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

  // 表格標題
  const AccountTitle = () => {
    return (
      <tr>
        <th></th>
        <th>帳號</th>
        <th>姓名</th>
        <th>權限</th>
        <th>資訊</th>
      </tr>
    );
  };
  // 表格內容
  const AccountInfo = ({ admin_unique_id, admin_name, admin_account }) => {
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
              btnAriaLabel="刪除帳號"
              //   btnDisabled={isDisableDeleteBtn}
              btnOnclickEventName={() => {}}
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
                // setSearchInfo(event.target.value);
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
              {/* {filteraccountInfo.map((item, index) => {
                return <AccountInfo key={index} {...item} />;
              })} */}
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
          onPageChange={(page) => console.log(page.selected)}
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
    </Container>
  );
}
