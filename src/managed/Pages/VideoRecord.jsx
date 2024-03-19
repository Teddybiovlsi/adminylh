import * as XLSX from "xlsx";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Col, Container, Form, Row, Table } from "react-bootstrap";
import PageTitleHeading from "../../components/PageTitleHeading";
import { useParams } from "react-router-dom";
import { get } from "../axios";
import LoadingComponent from "../../components/LoadingComponent";
import styles from "../../styles/pages/VideoRecordPage.module.scss";
import healthCareType from "../JsonFile/SelectClassTypeList.json";
import healthCareLanguage from "../JsonFile/SelectLanguageList.json";
import BtnBootStrap from "../../components/BtnBootstrap";
import { RiFileExcel2Line } from "react-icons/ri";
import { BiReset } from "react-icons/bi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
  Animation: {
    duration: 2000,
    onprogress: function (animation) {
      progress.value =
        animation.animationObject.currentStep /
        animation.animationObject.numSteps;
    },
  },
  maintainAspectRatio: false,
  // aspectRatio: 1,
};

export default function VideoRecord({ admin }) {
  // 透過 useParams() 取得網址上的參數
  const { type } = useParams();
  // 透過解構賦值取得admin裡的token
  const { token } = admin;

  const pageTitle = `${type}觀看紀錄`;

  // 取得繪製圖表的資料
  const [chartData, setChartData] = useState({});

  // 透過API取得所有影片的資料
  const [recordData, setRecordData] = useState([]);

  // 透過篩選條件如(必要條件：網址上的參數)、(選填：語言、類型），篩選出符合條件的影片資料
  const [filterRecordData, setFilterRecordData] = useState([]);

  // 判斷是否載入中，初始render時為true
  const [isLoading, setIsLoading] = useState(true);

  // 透過下拉選單選擇影片類型和語言，篩選出符合條件的影片資料
  const healthCareTypeAriaLabel = "選擇影片類型";
  const healthCareLanguageAriaLabel = "選擇影片語言";
  const [healthCareTypeValue, setHealthCareTypeValue] =
    useState("請選擇影片類型");
  const [healthCareLanguageValue, setHealthCareLanguageValue] =
    useState("請選擇影片語言");

  // 在render時，透過API取得所有影片的紀錄資料
  useEffect(() => {
    let ignore = false;

    const fetchVideoRecordAsync = async () => {
      await fetchVideoRecord({
        api: `record/videos/${token}`,
      });
    };

    if (!ignore) {
      fetchVideoRecordAsync();
    }
    return () => {
      ignore = true;
    };
  }, []);

  const fetchVideoRecord = async ({ api }) => {
    try {
      const { data } = await get(api);
      const result = data.data;
      setRecordData(result);
      const recordData = result.filter((item) => item.type === type);
      setFilterRecordData(recordData);
      setChartData({
        labels: recordData ? recordData.map((item) => item.name) : [],
        datasets: [
          {
            type: "bar",
            label: "影片總觀看次數",
            data: recordData
              ? recordData.map(
                  (item) => item.caregiverWatchTimes + item.guestWatchTimes
                )
              : [],
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      });
      setIsLoading(false);
    } catch (error) {}
  };

  /**
   * 當篩選條件改變時，篩選出符合條件的影片資料
   * @returns 篩選出符合條件的影片資料
   * @description
   * 1. 篩選出符合條件的影片資料
   * 2. 設定篩選出的影片資料
   * 3. 設定繪製圖表的資料
   * @example
   * filterAndSetData();
   */
  const filterAndSetData = () => {
    let filterData = recordData.filter((item) => {
      return (
        item.type === type &&
        (healthCareTypeValue === "請選擇影片類型" ||
          item.class === healthCareTypeValue) &&
        (healthCareLanguageValue === "請選擇影片語言" ||
          item.language === healthCareLanguageValue)
      );
    });

    setFilterRecordData(filterData);

    setChartData({
      labels: filterData.map((item) => item.name),
      datasets: [
        {
          label: "影片總觀看次數",
          data: filterData.map(
            (item) => item.caregiverWatchTimes + item.guestWatchTimes
          ),
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    });
  };

  useEffect(() => {
    if (recordData.length === 0) return;
    filterAndSetData();
  }, [type, healthCareTypeValue, healthCareLanguageValue]);

  /**
   * 取得影片觀看紀錄表格的標頭
   * @returns 影片觀看紀錄表格的標頭
   * @example
   * <TableHeader />
   */
  function TableHeader() {
    return (
      <thead>
        <tr>
          <th>名稱</th>
          <th>語言</th>
          <th>影片總觀看次數</th>
        </tr>
      </thead>
    );
  }

  /**
   * 取得影片觀看紀錄表格的內容
   * @param {Object} item 影片觀看紀錄資料
   * @returns 影片觀看紀錄表格的內容
   * @example
   * <TableRow item={item} />
   * @description
   * 1. 顯示影片名稱，若字數超過5個字，則顯示前5個字，並在後面加上"..."
   * 2. 顯示影片語言
   * 3. 顯示訪客觀看次數
   * 4. 顯示用戶觀看次數
   */
  function TableRow({ item }) {
    console.log(item);
    return (
      <tr>
        <td title={item.name}>
          {item.name.length > 5 ? item.name.slice(0, 5) + "..." : item.name}
        </td>
        <td>{item.language}</td>
        <td>{item.caregiverWatchTimes + item.guestWatchTimes}</td>
      </tr>
    );
  }

  if (isLoading)
    return <LoadingComponent title={pageTitle} text="紀錄資訊載入中" />;

  return (
    <>
      <PageTitleHeading text={pageTitle} styleOptions={6} />

      <div className={styles.chartContainer}>
        <Bar data={chartData} options={options} height={"100vh"} />
      </div>
      <Container>
        <Row className="mb-3">
          <Col xs={12} sm={12} md={4} lg={3}>
            <Form.Select
              aria-label={healthCareTypeAriaLabel}
              value={healthCareTypeValue}
              onChange={(e) => {
                setHealthCareTypeValue(e.target.value);
              }}
            >
              {healthCareType.map((item, index) => (
                <option key={index} value={item.label}>
                  {item.label}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} sm={12} md={4} lg={3}>
            <Form.Select
              aria-label={healthCareLanguageAriaLabel}
              value={healthCareLanguageValue}
              onChange={(e) => {
                setHealthCareLanguageValue(e.target.value);
              }}
            >
              {healthCareLanguage.map((item, index) => (
                <option key={index} value={item.label}>
                  {item.label}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} sm={12} md={4} lg={3}>
            <div className="d-grid">
              <BtnBootStrap
                btnPosition=""
                btnSize="md"
                text={
                  <>
                    <BiReset style={{ fontSize: "1.5rem" }} />
                    重置
                  </>
                }
                variant="outline-secondary"
                onClickEventName={() => {
                  setHealthCareTypeValue("請選擇影片類型");
                  setHealthCareLanguageValue("請選擇影片語言");
                }}
              />
            </div>
          </Col>
          <Col xs={12} sm={12} md={4} lg={3}>
            <div className="d-grid">
              <BtnBootStrap
                btnPosition=""
                btnSize="md"
                text={
                  <>
                    <RiFileExcel2Line style={{ fontSize: "1.5rem" }} />
                    匯出Excel
                  </>
                }
                variant="outline-success"
                onClickEventName={() => {
                  // 欄位命名
                  const header = [
                    "影片類型",
                    "影片名稱",
                    "語言",
                    "影片總觀看次數",
                  ];

                  // 產生excel的資料
                  const excelData = recordData
                    .filter((item) => item.type === type)
                    .map((item) => {
                      return {
                        影片類型: item.class,
                        影片名稱: item.name,
                        語言: item.language,
                        影片總觀看次數:
                          item.caregiverWatchTimes + item.guestWatchTimes,
                      };
                    });

                  // 先創建一個包含表頭的工作表
                  const ws = XLSX.utils.json_to_sheet([header], {
                    skipHeader: true,
                  });

                  // 然後將數據添加到該工作表
                  XLSX.utils.sheet_add_json(ws, excelData, {
                    skipHeader: true,
                    origin: -1,
                  });

                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                  XLSX.writeFile(wb, `${type}影片觀看紀錄.xlsx`);
                }}
              />
            </div>
          </Col>
        </Row>
        {filterRecordData.length === 0 ? (
          <Row>
            <Col className="text-center">
              <h2>查無資料</h2>
            </Col>
          </Row>
        ) : (
          <Table striped size="sm">
            <TableHeader />
            <tbody>
              {filterRecordData.map((item, index) => (
                <TableRow key={index} item={item} />
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
}
