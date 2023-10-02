import * as XLSX from "xlsx";
import BtnBootstrap from "../../components/BtnBootstrap";
import { Form, Modal, Table } from "react-bootstrap";
import { post } from "../axios";
import React, { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ToastAlert from "../../components/ToastAlert";
import useModal from "../../hooks/useModal";
import styles from "../../styles/pages/HomePage.module.scss";

export default function MultiAddAdmin() {
  // 建立一個參考變數
  const inputRef = useRef(null);

  const [initialState, setInitialState] = useState({
    sheetData: [],
    result: [],
    pageSettings: {
      rowsPerPage: 10,
      currentPage: 1,
      lastPage: 1,
    },
    showData: [],
  });

  const { sheetData, result, pageSettings, showData } = initialState;

  const { rowsPerPage, currentPage, lastPage } = pageSettings;

  // 存放excel檔案的資料
  //   const [sheetData, setSheetData] = useState([]);
  // 存放後台帳號建立狀況
  //   const [result, setResult] = useState([]);
  // 存放每頁顯示的資料筆數
  //   const [rowsPerPage, setRowsPerPage] = useState(10);
  // 存放目前頁數
  //   const [currentPage, setCurrentPage] = useState(1);
  // 存放目前頁數的資料
  //   const [showData, setShowData] = useState(sheetData.slice(0, rowsPerPage));
  //   const [lastPage, setLastPage] = useState(1);

  const [show, handleClose, handleShow] = useModal();

  const [uploadResult, setUploadResult] = useState(false);
  const handleCloseResult = () => setUploadResult(false);

  const readUploadFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      workbook.SheetNames.forEach((sheet) => {
        const rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );
        setInitialState({
          ...initialState,
          sheetData: rowObject,
        });
      });
    };
    reader.readAsBinaryString(file);
  };
  // 清除上傳的檔案
  const handleresetForm = (e) => {
    e.preventDefault();
    inputRef.current.value = null;
    setInitialState({
      ...initialState,
      sheetData: [],
    });
  };

  useEffect(() => {
    const rows = sheetData.length;
    setInitialState({
      ...initialState,
      pageSettings: {
        ...pageSettings,
        lastPage: Math.ceil(rows / rowsPerPage),
      },
      showData: sheetData.slice(0, rowsPerPage),
    });
  }, [sheetData, rowsPerPage]);

  const handlePageChange = (page) => {
    const start = (page - 1) * rowsPerPage;
    const end = start + Number(rowsPerPage);

    setInitialState({
      ...initialState,
      showData: sheetData.slice(start, end),
      pageSettings: {
        ...pageSettings,
        currentPage: page,
      },
    });
  };

  const handleSubmit = () => {
    // the sheetdata key must be the name of the "data" in the backend
    const data = {
      data: sheetData,
    };

    sendAdminInfo(data);
  };

  const sendAdminInfo = async (data) => {
    let AdminSubmit = toast.loading("資料上傳中...");
    try {
      // 將Modal關閉
      handleClose();
      const response = await post("admins", data);
      toast.update(AdminSubmit, {
        render: "資料上傳成功",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setInitialState({
        ...initialState,
        result: response.data.data,
      });
      setUploadResult(true);
    } catch (error) {
      const { message } = error.response.data;
      console.log(message);
      toast.update(AdminSubmit, {
        render: "資料上傳失敗",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container pb-4">
      <h1 className={styles.container_firstHeading}>批次新增帳號</h1>
      <div className="container">
        <Form.Group controlId="formFile">
          <Form.Label>
            <h2>
              <strong>請匯入批次建立帳號之excel檔案</strong>
            </h2>
            <a href="https://docs.google.com/spreadsheets/d/18fUj27fbdJO_YneQD3gwgxug8XmPVb37/export?format=xlsx">
              範例檔案
            </a>
          </Form.Label>

          <Form.Control
            ref={inputRef}
            type="file"
            name="videoFileInput"
            accept=".xlsx"
            onChange={readUploadFile}
          />
        </Form.Group>

        <BtnBootstrap
          variant="outline-secondary"
          type="reset"
          btnPosition="mt-3 mb-2 me-2"
          onClickEventName={handleresetForm}
          text="清除"
        />
        <BtnBootstrap
          variant="outline-primary"
          type="button"
          btnPosition="mt-3 mb-2 float-end"
          onClickEventName={handleShow}
          disabled={sheetData.length === 0}
          text="送出"
        />
      </div>
      {sheetData.length > 0 ? (
        <div>
          <Form.Select
            aria-label="請選擇每頁顯示筆數"
            className="float-end"
            style={{ width: "200px" }}
            onChange={(e) => {
              setInitialState({
                ...initialState,
                pageSettings: {
                  ...pageSettings,
                  rowsPerPage: Number(e.target.value),
                },
              });
            }}
          >
            <option value="10">每頁顯示10筆</option>
            <option value="50">每頁顯示50筆</option>
            <option value="100">每頁顯示100筆</option>
          </Form.Select>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>管理員名稱</th>
                <th>管理員帳號</th>
                <th>管理員信箱</th>
              </tr>
            </thead>
            <tbody>
              {showData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.AdminName}</td>
                    <td>{item.AdminAccount}</td>
                    <td>{item.AdminMail}</td>
                  </tr>
                );
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
      ) : null}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>請確認是否上傳</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>確認上傳請按確認鍵，否則請按X鍵</p>
        </Modal.Body>
        <Modal.Footer>
          <BtnBootstrap
            variant="outline-primary"
            type="submit"
            btnPosition="float-end"
            onClickEventName={handleSubmit}
            text="確認"
          />
        </Modal.Footer>
      </Modal>
      <Modal show={uploadResult} onHide={handleCloseResult}>
        <Modal.Header closeButton>
          <Modal.Title>上傳資訊</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>成功：{result.success}個</p>
            <p>重複：{result.repeat}個</p>
            {result.trash > 0 ? <p>於垃圾桶中：{result.trash}個</p> : null}
          </div>
        </Modal.Body>
      </Modal>
      <ToastAlert />
    </div>
  );
}
