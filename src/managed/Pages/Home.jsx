import { React, useEffect, useState } from "react";
import { Form, Table, Pagination } from "react-bootstrap";
import { get, post } from "../axios";
import styles from "../../styles/pages/HomePage.module.scss";
import { check } from "prettier";
import StatusCode from "../../sys/StatusCode";
import ReactPaginate from "react-paginate";

export default function Home() {
  // limit video data size in one page
  const [size, setSize] = useState(10);
  // videoData is an array
  const [videoData, setVideoData] = useState([
    {
      id: 0,
      video_id: "",
      video_name: "",
      video_path: "",
      video_language: "",
      video_class: "",
    },
  ]);

  const [isCheckAllVideo, setIsCheckAllVideo] = useState(false);
  const [selectVideoindex, setSelectVideoindex] = useState([]);
  // loading is true, show loading text, until loading is false
  const [loading, setLoading] = useState(false);
  // 取得影片類別
  // selectVideoType is 0, get all video data
  const [selectVideoType, setSelectVideoType] = useState(0);
  // 取得影片語系
  // selectVideoLanguage is 0, get all video data
  const [selectVideoLanguage, setSelectVideoLanguage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // track current page number
  const [currentPage, setCurrentPage] = useState(1);
  // track total page number
  const [totalPage, setTotalPage] = useState(0);
  // track total video data size
  const [itemOffset, setItemOffset] = useState(0);
  // track current page video data size
  const endOffset = itemOffset + size;
  // get current page video data
  const currentItem = videoData.slice(itemOffset, endOffset);

  const fetchVideoData = async ({ api }) => {
    try {
      const response = await get(api);
      // confirm response data
      // console.log(response);

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
      setVideoData(checkIsArray ? data : [data]);
      // 將 loading 設為 false
      setLoading(false);
      // clear error message
      setErrorMessage("");
    } catch (error) {
      // if catch error, clear videoData
      setVideoData([]);
      // 將 loading 設為 false
      setLoading(false);
      // if error.response is true, get error message
      if (error.response) {
        console.log(error.response);
        setErrorMessage(StatusCode(error.response.status));
      }
    }
  };

  useEffect(() => {
    // set loading to true
    setLoading(true);
    // if selectVideoType is 0 and selectVideoLanguage is 0, get all video data
    if (selectVideoType == 0 && selectVideoLanguage == 0) {
      // get all video data
      fetchVideoData({
        api: "videos",
      });
    }
    // if selectVideoType is not 0 and selectVideoLanguage is 0, get video data by video type
    else if (selectVideoType != 0 && selectVideoLanguage == 0) {
      // get video data by video type
      fetchVideoData({
        api: `/videoClass/${selectVideoType}`,
      });
    } else if (selectVideoType == 0 && selectVideoLanguage != 0) {
      // get video data by video language
      fetchVideoData({
        api: `videoLanguage/${selectVideoLanguage}`,
      });
    } else if (selectVideoType != 0 && selectVideoLanguage != 0) {
      // get video data by video type and video language
      fetchVideoData({
        api: `/videoByClassAndLanguage/${selectVideoType}/${selectVideoLanguage}`,
      });
      setLoading(false);
    }
    // 若發生例外情形，則將錯誤訊息顯示在畫面上
    else {
      setLoading(false);
      setVideoData([]);
      setErrorMessage("發生錯誤");
    }
  }, [selectVideoType, selectVideoLanguage]);

  // if videoData have any change and it's not empty, set totalPage to Math.ceil(videoData.length / size)
  useEffect(() => {
    if (videoData.length > 0) {
      setTotalPage(Math.ceil(videoData.length / size));
    }
  }, [videoData, size]);

  // if selectVideoindex have check all videoData ID, set isCheckAllVideo to true
  useEffect(() => {
    if (selectVideoindex.length == videoData.length) {
      setIsCheckAllVideo(true);
    } else {
      setIsCheckAllVideo(false);
    }
  }, [selectVideoindex, videoData]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * size) % videoData.length;
    setItemOffset(newOffset);
  };

  // if select all video, set isCheckAllVideo to true and set selectVideoindex to all video ID
  const handleSelectAllVideo = () => {
    // set isCheckAllVideo to !isCheckAllVideo
    setIsCheckAllVideo(!isCheckAllVideo);
    // if isCheckAllVideo is true, set selectVideoindex to []
    // otherwise, set selectVideoindex to all video ID

    isCheckAllVideo
      ? setSelectVideoindex([])
      : setSelectVideoindex(videoData.map((item) => item.id));
  };

  const handleSelectVideoindex = (ID) => {
    // if selectVideoindex includes ID, set selectVideoindex to selectVideoindex filter ID
    // otherwise, set selectVideoindex to selectVideoindex add ID
    // selectVideoLanguage.includes(ID)
    //   ? setSelectVideoindex(selectVideoindex.filter((item) => item !== ID))
    //   : setSelectVideoindex([...selectVideoindex, ID]);
    setSelectVideoindex(
      selectVideoindex.includes(ID)
        ? selectVideoindex.filter((item) => item !== ID)
        : [...selectVideoindex, ID]
    );
  };

  // 表格標題
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

  const VideoInfo = ({
    id,
    video_name,
    video_path,
    video_class,
    video_language,
  }) => {
    return (
      <tr key={id}>
        <td className={styles.container_division_table_rowTable_data}>
          <input
            type="checkbox"
            // checked video by video ID
            checked={selectVideoindex.includes(id)}
            onChange={() => {
              handleSelectVideoindex(id);
            }}
            value={id}
            className={styles.container_division_table_rowTable_data_checkbox}
          />
        </td>
        <td className={styles.container_division_table_rowTable_data}>
          {video_class}
        </td>
        <td className={styles.container_division_table_rowTable_data}>
          {video_language}
        </td>
        <td className={styles.container_division_table_rowTable_data}>
          {video_name}
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <h1 className={styles.container_firstHeading}>影片資訊欄位</h1>
        <div className={styles.container_division}>
          <h2 className={styles.container_division_secondHeading}>
            資料載入中...
          </h2>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container">
        <h1 className={styles.container_firstHeading}>影片資訊欄位</h1>
        <div className={styles.container_division}>
          <h2 className={styles.container_division_secondHeading}>
            {errorMessage}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container pb-4">
      <h1 className={styles.container_firstHeading}>影片資訊欄位</h1>
      <div className={styles.container_division_select}>
        <Form.Select
          aria-label="請選擇影片類型"
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
          className="me-auto"
          aria-label="請選擇影片語言"
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
        <h5>
          <b>共有{videoData.length}筆資料</b>{" "}
        </h5>
        {/* use Form.Select to show 每頁顯示筆數 */}
        <Form.Select
          aria-label="請選擇每頁顯示筆數"
          onChange={(event) => {
            setSize(event.target.value);
          }}
          style={{ width: "200px" }}
        >
          <option value="1">每頁顯示1筆</option>
          <option value="10">每頁顯示10筆</option>
          <option value="50">每頁顯示50筆</option>
          <option value="100">每頁顯示100筆</option>
        </Form.Select>
      </div>
      {/* if videodata is not null and error message is empty, show data */}
      <div className={`mt-3 mb-3 ${styles.container_division}`}>
        <Table>
          <thead>
            <VideoTitle />
          </thead>
          <tbody>
            {videoData.map((info, _) => {
              return <VideoInfo {...info} key={info.id} />;
            })}
            {/* Create fake array */}
            {/* {Array.from(Array(30).keys()).map((info, _) => {
              return <VideoInfo {...info} key={info.ID} />;
            })} */}
          </tbody>
        </Table>
        <ReactPaginate
          breakLabel={"..."}
          previousLabel={"上一頁"}
          nextLabel={"下一頁"}
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          pageCount={totalPage}
          renderOnZeroPageCount={null}
          containerClassName="justify-content-center pagination"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          activeClassName="active"
          disabledClassName="disabled"
        />
      </div>
      <button className={`${styles.container_button}`}>
        創建
        <br />
        帳號
      </button>
    </div>
  );
}
