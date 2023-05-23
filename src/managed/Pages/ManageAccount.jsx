import React from "react";
import { Container, Navbar, Table } from "react-bootstrap";
import ToolTipBtn from "../../components/ToolTipBtn";
import styles from "../../styles/Form/ClientRegistration.module.scss";
import ShowLockIcon from "../../components/ShowLockIcon";

export default function ManageAccount() {
  const handleSelectAllAccount = () => {};
  const accountInfo = [
    {
      client_name: "顏銘德",
      client_unique_id: "6459df666ed5b",
      client_account: "R124865642",
      client_email: "M11113005@yuntech.edu.tw",
      client_login_times: 1,
      client_is_lock: 0,
    },
  ];
  // 表格標題
  const AccountTitle = () => {
    return (
      <tr>
        <th
          className={styles.container_division_table_rowTable_headingCheckBox}
        >
          <input
            type="checkbox"
            // onChange={() => {
            //   handleSelectAllVideo();
            // }}
            // checked={isCheckAllVideo}
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
      </tr>
    );
  };

  return (
    <div className="container pb-4">
      <h1 className={styles.container_firstHeading}>帳號資訊欄位</h1>
      <Navbar bg="light" variant="light">
        <Container>
          <div className="me-auto">
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="批次新增"
              // btnOnclickEventName=
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
              btnAriaLabel="刪除帳號"
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
        </Container>
      </Navbar>
      <div className={`mt-3 mb-3 ${styles.container_division}`}>
        <Table>
          <thead>
            <AccountTitle />
          </thead>
          <tbody>
            {accountInfo.map((item, index) => {
              return (
                <tr key={index}>
                  <td className={styles.container_division_table_rowTable_data}>
                    <input
                      type="checkbox"
                      // checked video by video ID
                      // checked={selectVideoindex.includes(id)}
                      // onChange={() => {
                      //   handleSelectVideoindex(id);
                      // }}
                      // value={id}
                      className={
                        styles.container_division_table_rowTable_data_checkbox
                      }
                    />
                  </td>
                  <td className={styles.container_division_table_rowTable_data}>
                    {item.client_account}
                  </td>
                  <td className={styles.container_division_table_rowTable_data}>
                    {item.client_name}
                  </td>
                  <td className={styles.container_division_table_rowTable_data}>
                    {/* {item.client_is_lock === 0 ? "啟用" : "停用"} */}
                    <ShowLockIcon
                      // islock={item.client_is_lock}
                      islock={1}
                      tooltipText="正常使用中"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
