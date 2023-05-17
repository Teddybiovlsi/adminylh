import limitPage from "../JsonFile/FilterPageContentSize.json";
import LanguageList from "../JsonFile/SelectLanguageList.json";
import ClassList from "../JsonFile/SelectClassTypeList.json";
import { React, useEffect, useState } from "react";
import {
  Form,
  Table,
  Pagination,
  Modal,
  Navbar,
  Container,
} from "react-bootstrap";
import { get, post } from "../axios";
import styles from "../../styles/pages/HomePage.module.scss";
import { check } from "prettier";
import StatusCode from "../../sys/StatusCode";
import Loading from "../../components/Loading";
import ReactPaginate from "react-paginate";
import { Link, redirect } from "react-router-dom";
import ToolTipBtn from "../../components/ToolTipBtn";

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
      video_language_index: "",
      video_class_index: "",
    },
  ]);

  const [filterVideoData, setFilterVideoData] = useState(videoData);

  const [isCheckAllVideo, setIsCheckAllVideo] = useState(false);
  const [selectVideoindex, setSelectVideoindex] = useState([]);
  const [selectVideoName, setSelectVideoName] = useState([]);
  // loading is true, show loading text, until loading is false
  const [loading, setLoading] = useState(false);
  // 取得影片類別
  // selectVideoType is 0, get all video data
  const [selectVideoType, setSelectVideoType] = useState(0);
  // 取得影片語系
  // selectVideoLanguage is 0, get all video data
  const [selectVideoLanguage, setSelectVideoLanguage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const [errorFilterMessage, setErrorFilterMessage] = useState("");
  // 創建用戶帳號button
  const [createUserButton, setCreateUserButton] = useState(true);

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
  // first render, get video data
  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      // set loading to true
      setLoading(true);
      fetchVideoData({
        api: "videos",
      });
    }
    return () => {
      ignore = true;
    };
  }, []);
  // get video data async function
  const fetchVideoData = async ({ api }) => {
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
      setVideoData(checkIsArray ? data : [data]);
      setFilterVideoData(checkIsArray ? data : [data]);
      // 將 loading 設為 false
      setLoading(false);
      // clear error message
      setErrorMessage("");
    } catch (error) {
      // if catch error, clear videoData
      setVideoData([]);
      setFilterVideoData([]);
      // 將 loading 設為 false
      setLoading(false);
      // if error.response is true, get error message
      if (error.response) {
        setErrorMessage(StatusCode(error.response.status));
      }
    }
  };

  useEffect(() => {
    if (filterVideoData.length == 0) {
      setErrorFilterMessage("該語言/類別中無資料");
    } else {
      setErrorFilterMessage("");
    }
  }, [filterVideoData]);

  useEffect(() => {
    if (selectVideoLanguage == 0 && selectVideoType == 0) {
      setFilterVideoData(videoData);
    } else if (selectVideoType == 0 && selectVideoLanguage != 0) {
      setFilterVideoData(
        videoData.filter(
          (item) => item.video_language_index == selectVideoLanguage
        )
      );
    } else if (selectVideoType != 0 && selectVideoLanguage == 0) {
      setFilterVideoData(
        videoData.filter((item) => item.video_class_index == selectVideoType)
      );
    } else {
      setFilterVideoData(
        videoData.filter(
          (item) =>
            item.video_class_index == selectVideoType &&
            item.video_language_index == selectVideoLanguage
        )
      );
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

  useEffect(() => {
    if (selectVideoindex.length == 0) {
      setSelectVideoName([]);
    } else if (selectVideoindex.length == videoData.length) {
      setSelectVideoName(videoData.map((item) => item.video_name));
    } else {
      selectVideoindex.map((item) => {
        const found = videoData.find(
          (element) => element.id == item
        ).video_name;

        setSelectVideoName(
          selectVideoName.includes(found)
            ? selectVideoName.filter((item) => item == found)
            : [...selectVideoName, found]
        );
      });
    }
  }, [selectVideoindex]);

  useEffect(() => {
    setCreateUserButton(selectVideoindex.length != 0 ? false : true);
  }, [selectVideoindex]);

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
    video_id,
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
          <Link
            to={`/Video/`}
            state={{ videoUUID: video_id, videoPath: video_path }}
          >
            {video_name}
          </Link>
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
            <Loading text="資訊載入中" />
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
      <Navbar bg="light" variant="light">
        <Container>
          <div className="me-auto">
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="新增影片"
              btnOnclickEventName={() => {
                console.log("you click me add video");
              }}
              btnText={
                <i
                  className="bi bi-file-earmark-plus"
                  style={{ fontSize: 1.2 + "rem" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="新增影片"
            />
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="修改影片"
              btnOnclickEventName={() => {
                console.log("you click me rewrite video");
              }}
              btnText={
                <i
                  className="bi bi-pencil-square"
                  style={{ fontSize: 1.2 + "rem" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="編輯影片"
            />
            <ToolTipBtn
              placement="bottom"
              btnAriaLabel="刪除影片"
              btnOnclickEventName={() => {
                console.log("you click me delete video");
              }}
              btnText={
                <i
                  className="bi bi-trash3-fill"
                  style={{ fontSize: 1.2 + "rem" }}
                ></i>
              }
              btnVariant="light"
              tooltipText="刪除影片"
            />
          </div>
        </Container>
      </Navbar>
      <div className={styles.container_division_select}>
        <Form.Select
          aria-label="請選擇影片類型"
          onChange={(event) => {
            setSelectVideoType(event.target.value);
          }}
          style={{ width: "200px" }}
        >
          {ClassList.map((item, _) => {
            return (
              <option key={item.id} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </Form.Select>
        <Form.Select
          className="me-auto"
          aria-label="請選擇影片語言"
          onChange={(event) => {
            setSelectVideoLanguage(event.target.value);
          }}
          style={{ width: "200px" }}
          selected={selectVideoLanguage}
        >
          {LanguageList.map((item, _) => {
            return (
              <option key={item.id} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </Form.Select>

        {/* use Form.Select to show 每頁顯示筆數 */}
        <Form.Select
          aria-label="請選擇每頁顯示筆數"
          onChange={(event) => {
            setSize(event.target.value);
          }}
          style={{ width: "200px" }}
          selected={size}
        >
          {
            // use map to show 每頁顯示筆數
            limitPage.map((limit, _) => {
              return (
                <option key={limit.id} value={limit.value}>
                  每頁顯示{limit.value}筆
                </option>
              );
            })
          }
        </Form.Select>
      </div>

      {errorFilterMessage == "" && (
        <div className={`mt-3 mb-3 ${styles.container_division}`}>
          <Table>
            <thead>
              <VideoTitle />
            </thead>
            <tbody>
              {filterVideoData.map((info, _) => {
                return <VideoInfo {...info} key={info.id} />;
              })}
            </tbody>
          </Table>
          <ReactPaginate
            breakLabel={"..."}
            previousLabel={"<"}
            nextLabel={">"}
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
      )}

      {errorFilterMessage != "" && (
        <div className={`mt-3 mb-3 ${styles.container_division}`}>
          <h2 className={styles.container_division_secondHeading}>
            {errorFilterMessage}
          </h2>
        </div>
      )}

      <button className={styles.container_button} disabled={createUserButton}>
        <Link
          to={!createUserButton ? "/Client/Register" : null}
          state={{
            videoIndex: selectVideoindex,
            videoName: selectVideoName,
            videoData: videoData,
          }}
          className={styles.disabledLink}
        >
          <b>
            創建
            <br />
            帳號
          </b>
        </Link>
      </button>
    </div>
  );
}
