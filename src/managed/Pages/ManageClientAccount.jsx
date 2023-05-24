import React, { useEffect } from 'react';
import { get } from '../axios';
import { Container, Form, Modal, Navbar, Table } from 'react-bootstrap';
import ToolTipBtn from '../../components/ToolTipBtn';
import ShowLockIcon from '../../components/ShowLockIcon';
import ShowInfoIcon from '../../components/ShowInfoIcon';
import CustomState from '../JsonFile/SelectCustomerState.json';
import styles from '../../styles/Form/ClientRegistration.module.scss';

export default function ManageClientAccount() {
  const handleSelectAllAccount = () => {};
  const [accountInfo, setAccountInfo] = React.useState([]);
  // 用來儲存篩選後的資料
  const [filteraccountInfo, setFilteraccountInfo] = React.useState(null);
  // 用來儲存篩選後的資料，用於懸浮視窗Modal
  const [filterPersonInfo, setFilterPersonInfo] = React.useState(null);
  // 用來儲存用戶狀態(啟用/停用)
  const [userState, setUserState] = React.useState('');

  // 若帳號資訊尚未載入完成，則顯示Loading
  const [loading, setLoading] = React.useState(false);
  // 若帳號資訊載入失敗，則顯示錯誤訊息
  const [errorMessage, setErrorMessage] = React.useState('');

  // first render, get acoount data
  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      // set loading to true
      setLoading(true);
      fetchaAccountData({
        api: 'account',
      });
    }
    return () => {
      ignore = true;
    };
  }, []);

  // after first render, get account data every 5 minutes
  // 因為單位是毫秒，所以 5 * 60 * 1000 = 5 分鐘
  useEffect(() => {
    setInterval(() => {
      fetchaAccountData({
        api: 'account',
      });
    }, 5 * 60 * 1000);
  }, []);

  useEffect(() => {
    if (userState == 0) {
      console.log('啟用');
    } else if (userState == 1) {
      console.log('停用');
    } else {
      console.log('全部');
    }
  }, [userState]);

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
      // 將 loading 設為 false
      setLoading(false);
      // clear error message
      setErrorMessage('');
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
      return account.slice(0, 3) + '***' + account.slice(6, 10);
    } else if (account.length === 11) {
      return account.slice(0, 3) + '***' + account.slice(7, 11);
    }
  };
  // 將姓名敏感資訊做處理
  const handleNameAccount = (name) => {
    if (name.length === 3) {
      return name.slice(0, 1) + 'O' + name.slice(2, 3);
    } else if (name.length === 4) {
      return name.slice(0, 1) + 'OO' + name.slice(3, 4);
    } else if (name.length === 2) {
      return name.slice(0, 1) + 'O';
    } else {
      return name;
    }
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
            type='checkbox'
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
        <th className={styles.container_division_table_rowTable_headingName}>
          資訊
        </th>
      </tr>
    );
  };

  return (
    <div className='container pb-4'>
      <h1 className={styles.container_firstHeading}>帳號資訊欄位</h1>
      <Navbar bg='light' variant='light'>
        <Container>
          <div className='me-auto'>
            <ToolTipBtn
              placement='bottom'
              btnAriaLabel='批次新增'
              // btnOnclickEventName=
              btnText={
                <i
                  className='bi bi-person-plus-fill'
                  style={{ fontSize: 1.2 + 'rem' }}
                ></i>
              }
              btnVariant='light'
              tooltipText='批次新增帳號'
            />
            <ToolTipBtn
              placement='bottom'
              btnAriaLabel='編輯帳號'
              // btnDisabled={
              // }
              // btnOnclickEventName={handleEditVideo}
              btnText={
                <i
                  className='bi bi-pencil-square'
                  style={{ fontSize: 1.2 + 'rem' }}
                ></i>
              }
              btnVariant='light'
              tooltipText='編輯帳號'
            />
            <ToolTipBtn
              placement='bottom'
              btnAriaLabel='解鎖帳號'
              // btnDisabled={
              // }
              // btnOnclickEventName={handleEditVideo}
              btnText={
                <i
                  className='bi bi-unlock-fill'
                  style={{ fontSize: 1.2 + 'rem' }}
                ></i>
              }
              btnVariant='light'
              tooltipText='解鎖帳號'
            />
            <ToolTipBtn
              placement='bottom'
              btnAriaLabel='刪除帳號'
              // btnDisabled={
              // }
              // btnOnclickEventName={() => {

              // }}
              btnText={
                <i
                  className='bi bi-trash3-fill'
                  style={{ fontSize: 1.2 + 'rem' }}
                ></i>
              }
              btnVariant='light'
              tooltipText='刪除帳號'
            />
          </div>
        </Container>
      </Navbar>
      <div className={styles.container_division_select}>
        <Form.Select
          aria-label='請選擇使用者狀態'
          onChange={(event) => {
            setUserState(event.target.value);
          }}
          style={{ width: '200px' }}
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
                      type='checkbox'
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
                    {handleIdAccount(item.client_account)}
                  </td>
                  <td className={styles.container_division_table_rowTable_data}>
                    {handleNameAccount(item.client_name)}
                  </td>
                  <td className={styles.container_division_table_rowTable_data}>
                    <ShowLockIcon
                      placement='bottom'
                      islock={item.client_is_lock}
                      tooltipText={
                        item.client_is_lock === 0 ? '開放使用中' : '鎖定中'
                      }
                    />
                  </td>
                  <td className={styles.container_division_table_rowTable_data}>
                    <ShowInfoIcon
                      placement='bottom'
                      btnAriaLabel='帳號資訊'
                      btnOnclickEventName={() => {
                        AccountInfoModal(item.client_account);
                      }}
                      btnSize='sm'
                      tooltipText='帳號資訊'
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Modal
          show={filterPersonInfo != null}
          onHide={handleCloseAccountModal}
        >
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
