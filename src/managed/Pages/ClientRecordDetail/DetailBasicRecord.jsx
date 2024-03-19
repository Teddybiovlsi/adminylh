import React, { useState, useEffect } from "react";
import {
  Accordion,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Modal,
  Row,
} from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { MdSort } from "react-icons/md";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import PageTitleHeading from "../../../components/PageTitleHeading";

import { convertTimestampToDateOrTime } from "../../js/dateTimeFormat";
import { compareDates, compareScores } from "../../js/userRecordSort";

import styles from "../../../styles/pages/VideoRecordPage.module.scss";

// 註冊 Chart.js 的插件和元件
// CategoryScale: 用於創建類別軸
// LinearScale: 用於創建線性軸
// PointElement: 用於創建點元素
// LineElement: 用於創建線元素
// Title: 用於創建標題
// Tooltip: 用於創建工具提示
// Legend: 用於創建圖例
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
};

export default function DetailBasicRecord() {
  const navigate = useNavigate();
  const { name, videoName } = useParams();
  let location = useLocation();

  if (!location.state || !location.state.from === "ManageClientRecord") {
    navigate("/", { replace: true });
  }
  let userRecord = location.state && location.state.userRecord;

  // 計算平均分數
  const averageScore =
    userRecord &&
    userRecord.reduce((sum, item) => sum + item.accuracy, 0) /
      userRecord.length;

  // 將useParams()取得的參數組合成標題
  const pageTitle = `${name}的${videoName}紀錄`;

  const [recordData, setRecordData] = useState(userRecord);
  const [defaultSort, setDefaultSort] = useState("latestDate");
  const [defaultSortOrder, setDefaultSortOrder] = useState("dsc"); // asc: 升序, dsc: 降序
  const [recordProfile, setRecordProfile] = useState(null); // 紀錄作答情形
  const [chartData, setChartData] = useState({
    labels:
      userRecord &&
      userRecord.map((item) => {
        const date = new Date(item.latestQuizDate);
        return date.toLocaleDateString();
      }),
    datasets: [
      {
        label: "分數",
        data: userRecord && userRecord.map((item) => item.accuracy),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "平均分數",
        data: Array(userRecord.length).fill(averageScore),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderDash: [5, 5], // 使線條變為虛線
      },
    ],
  }); // 繪製圖表的資料

  useEffect(() => {
    const sortFunctions = {
      latestDate: (a, b) =>
        compareDates(a.latestQuizDate, b.latestQuizDate, defaultSortOrder),
      sortScore: (a, b) =>
        compareScores(a.accuracy, b.accuracy, defaultSortOrder),
    };

    if (sortFunctions[defaultSort]) {
      setRecordData(recordData.sort(sortFunctions[defaultSort]));
      setChartData({
        labels: recordData.sort(sortFunctions[defaultSort]).map((item) => {
          const date = new Date(item.latestQuizDate);
          return date.toLocaleDateString();
        }),
        datasets: [
          {
            label: "分數",
            data: recordData
              .sort(sortFunctions[defaultSort])
              .map((item) => item.accuracy),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
          {
            label: "平均分數",
            data: Array(recordData.length).fill(averageScore),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderDash: [5, 5], // 使線條變為虛線
          },
        ],
      });
    }
  }, [defaultSort, defaultSortOrder]);

  return (
    <>
      <PageTitleHeading text={pageTitle} styleOptions={6} />
      <div className={styles.chartContainer}>
        <Line data={chartData} options={options} height={"100vh"} />
      </div>
      <Container>
        <Row>
          <Col className="fs-5 mb-2" role="button">
            <DropdownButton
              id={`dropdown-button-drop`}
              variant="outline-primary rounded-5"
              title={
                <>
                  排序方式
                  <MdSort className="my-auto" />
                </>
              }
            >
              <Dropdown.Item
                eventKey="latestDate"
                onClick={() => {
                  setDefaultSort("latestDate");
                  setDefaultSortOrder("dsc");
                  if (defaultSort === "latestDate") {
                    setDefaultSortOrder(
                      defaultSortOrder === "asc" ? "dsc" : "asc"
                    );
                  }
                }}
                active={defaultSort === "latestDate"}
              >
                最新日期
                {defaultSort === "latestDate" ? (
                  defaultSortOrder === "asc" ? (
                    <FaArrowUp />
                  ) : (
                    <FaArrowDown />
                  )
                ) : null}
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="sortScore"
                onClick={() => {
                  setDefaultSort("sortScore");
                  setDefaultSortOrder("dsc");
                  if (defaultSort === "sortScore") {
                    setDefaultSortOrder(
                      defaultSortOrder === "asc" ? "dsc" : "asc"
                    );
                  }
                }}
                active={defaultSort === "sortScore"}
              >
                分數
                {defaultSort === "sortScore" ? (
                  defaultSortOrder === "asc" ? (
                    <FaArrowUp />
                  ) : (
                    <FaArrowDown />
                  )
                ) : null}
              </Dropdown.Item>
            </DropdownButton>
          </Col>
        </Row>
        {recordData.map((data, index) => {
          const { latestQuizDate, accuracy } = data;
          const formatLatestQuizDate = convertTimestampToDateOrTime(
            latestQuizDate,
            "date"
          );
          const formatLatestQuizTime = convertTimestampToDateOrTime(
            latestQuizDate,
            "time"
          );
          return (
            <Row
              className="mb-2 p-3 border border-2 rounded-3 shadow justify-content-md-center"
              key={`rowButton${Math.random(index)}`}
              role="button"
              onClick={() => {
                setRecordProfile(data.eachQuizAnswerContent);
              }}
              xs={12}
              sm={12}
              md={12}
            >
              <Col className="fs-4">
                {formatLatestQuizDate}
                <br />
                {formatLatestQuizTime}
              </Col>
              <Col className="fs-2 text-end my-auto">
                <b
                  className={accuracy === 100 ? "text-success" : "text-danger"}
                >
                  {accuracy}
                </b>
                分
              </Col>
            </Row>
          );
        })}
        <Modal
          show={recordProfile !== null}
          onHide={() => {
            setRecordProfile(null);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>作答情形</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Accordion>
              {recordProfile &&
                recordProfile.map((recordProfile, index) => {
                  return (
                    <Accordion.Item eventKey={recordProfile.questionContent}>
                      <Accordion.Header>
                        <b
                          className={
                            recordProfile.isValid
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          問題：{recordProfile.questionContent}
                        </b>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Container>
                          <Row>
                            <p>
                              <b className="text-primary">作答內容:</b>
                              {recordProfile.responseContent}
                            </p>
                          </Row>
                          <Row>
                            <p>
                              <b className="text-primary">是否正確:</b>
                              <b
                                className={
                                  recordProfile.isValid
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                {recordProfile.isValid ? "正確" : "錯誤"}
                              </b>
                            </p>
                          </Row>
                          {recordProfile.isValid === false && (
                            <Row>
                              <p>
                                <b className="text-primary">正確答案:</b>
                                <b className="text-success">
                                  {recordProfile.correctAnswer}
                                </b>
                              </p>
                            </Row>
                          )}
                        </Container>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
            </Accordion>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
