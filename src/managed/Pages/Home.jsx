import { React, useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { get, post } from "../axios";
import styles from "../../styles/pages/HomePage.module.scss";

export default function Home() {
  const [videoData, setVideoData] = useState([
    {
      ID: 0,
      ClassID: "",
      Language: "",
      Title: "",
    },
  ]);
  const [isCheckAllVideo, setIsCheckAllVideo] = useState(false);
  const [selectVideoindex, setSelectVideoindex] = useState([]);
  // 取得影片類別
  // selectVideoType is 0, get all video data
  const [selectVideoType, setSelectVideoType] = useState(0);
  // 取得影片語系
  // selectVideoLanguage is 0, get all video data
  const [selectVideoLanguage, setSelectVideoLanguage] = useState(0);
  const [ErrorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // if selectVideoType is 0 and selectVideoLanguage is 0, get all video data
    if (selectVideoType == 0 && selectVideoLanguage == 0) {
      // get all video data
      // if success, set videoData to res.data
      // otherwise, set error message

      axios({
        method: "get",
        url: "http://140.125.35.82:8079/ntuh-API/public/api/v1/GET/videos",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          // if res.data is an array, set videoData to res.data
          // otherwise, convert res.data to an array and set videoData to it
          setVideoData(
            Array.isArray(res.data.data) ? res.data.data : [res.data.data]
          );
          setErrorMessage("");
        })
        .catch((err) => {
          // set error message
          setVideoData([]);
          setErrorMessage(err.response.data.message);
        });
    }
    // if selectVideoType is not 0 and selectVideoLanguage is 0, get video data by video type
    else if (selectVideoType != 0 && selectVideoLanguage == 0) {
      console.log("selectVideoType");
      axios({
        // get video data by video type
        method: "get",
        url: `http://140.125.35.82:8079/ntuh-API/public/api/v1/GET/videoClass/${selectVideoType}`,
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          // if res.data is an array, set videoData to res.data
          // otherwise, convert res.data to an array and set videoData to it
          setVideoData(
            Array.isArray(res.data.data) ? res.data.data : [res.data.data]
          );
          setErrorMessage("");
        })
        .catch((err) => {
          // set error message
          setVideoData([]);
          setErrorMessage(err.response.data.message);
        });
    } else if (selectVideoType == 0 && selectVideoLanguage != 0) {
      console.log("selectVideoLanguage");
      axios({
        // get video data by video language
        method: "get",
        url: `http://140.125.35.82:8079/ntuh-API/public/api/v1/GET/videoLanguage/${selectVideoLanguage}`,
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          // if res.data is an array, set videoData to res.data
          // otherwise, convert res.data to an array and set videoData to it
          setVideoData(
            Array.isArray(res.data.data) ? res.data.data : [res.data.data]
          );
          setErrorMessage("");
        })
        .catch((err) => {
          // set error message
          setVideoData([]);
          setErrorMessage(err.response.data.message);
        });
    } else if (selectVideoType != 0 && selectVideoLanguage != 0) {
      axios({
        // get video data by video type and video language
        method: "get",
        url: `http://140.125.35.82:8079/ntuh-API/public/api/v1/GET/videoByClassAndLanguage/${selectVideoType}/${selectVideoLanguage}`,
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          // if res.data is an array, set videoData to res.data
          // otherwise, convert res.data to an array and set videoData to it
          setVideoData(
            Array.isArray(res.data.data) ? res.data.data : [res.data.data]
          );
          setErrorMessage("");
        })
        .catch((err) => {
          // set error message
          setVideoData([]);
          setErrorMessage(err.response.data.message);
        });
    }
    // 若發生例外情形，則將錯誤訊息顯示在畫面上
    else {
      setVideoData([]);
      setErrorMessage("發生錯誤");
    }
  }, [selectVideoType, selectVideoLanguage]);

  // if select all video, set isCheckAllVideo to true and set selectVideoindex to all video ID
  const handleSelectAllVideo = () => {
    setIsCheckAllVideo(!isCheckAllVideo);
    setSelectVideoindex(videoData.map((item) => item.ID));
    if (isCheckAllVideo) {
      setSelectVideoindex([]);
    }
  };

  const handleSelectVideoindex = (ID) => {
    if (selectVideoindex.includes(ID)) {
      setSelectVideoindex(selectVideoindex.filter((item) => item !== ID));
    } else {
      setSelectVideoindex([...selectVideoindex, ID]);
    }
  };

  const VideoTitle = () => {
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
            checked={isCheckAllVideo}
            className={
              styles.container_division_table_rowTable_heading_checkbox
            }
          />
        </th>
        <th className={styles.container_division_table_rowTable_headingType}>
          類型
        </th>
        <th
          className={styles.container_division_table_rowTable_headingLanguage}
        >
          語言
        </th>
        <th className={styles.container_division_table_rowTable_headingName}>
          名稱
        </th>
      </tr>
    );
  };

  const VideoInfo = ({ ID, ClassID, Language, Title }) => {
    return (
      <tr key={ID}>
        <td className={styles.container_division_table_rowTable_data}>
          <input
            type="checkbox"
            checked={selectVideoindex.includes(ID)}
            onChange={() => {
              handleSelectVideoindex(ID);
            }}
            value={ID}
            className={styles.container_division_table_rowTable_data_checkbox}
          />
        </td>
        <td className={styles.container_division_table_rowTable_data}>
          {ClassID}
        </td>
        <td className={styles.container_division_table_rowTable_data}>
          {Language}
        </td>
        <td className={styles.container_division_table_rowTable_data}>
          {Title}
        </td>
      </tr>
    );
  };

  return (
    <div className="container">
      <h1 className={styles.container_firstHeading}>影片資訊欄位</h1>
      <div className={styles.container_division}>
        <Form.Select
          aria-label="Default select example"
          onChange={(event) => {
            setSelectVideoType(event.target.value);
          }}
          style={{ width: "200px" }}
        >
          <option value="0">請選擇影片類型</option>
          <option value="1">疾病照護</option>
          <option value="2">活動</option>
          <option value="3">進食</option>
          <option value="4">管路照護及異常處理</option>
          <option value="5">皮膚照護</option>
          <option value="6">傷口照護</option>
          <option value="7">預防合併症</option>
        </Form.Select>
        <Form.Select
          aria-label="Default select example"
          onChange={(event) => {
            setSelectVideoLanguage(event.target.value);
          }}
          style={{ width: "200px" }}
        >
          <option value="0">請選擇影片語言</option>
          <option value="1">國語</option>
          <option value="2">台語</option>
          <option value="3">英語</option>
          <option value="4">日文</option>
          <option value="5">越南語</option>
          <option value="6">泰語</option>
          <option value="7">印尼語</option>
          <option value="8">菲律賓語</option>
        </Form.Select>
      </div>
      {/* if don't have any error message or videoData go to show data */}
      {ErrorMessage !== "" || videoData == null ? (
        <div className={styles.container_division}>
          <h2 className={styles.container_division_secondHeading}>
            {ErrorMessage}
          </h2>
        </div>
      ) : (
        <div className={`mt-3 mb-3 ${styles.container_division}`}>
          <Table>
            <thead>
              <VideoTitle />
            </thead>
            <tbody>
              {videoData.map((info, _) => {
                return <VideoInfo {...info} key={info.ID} />;
              })}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
