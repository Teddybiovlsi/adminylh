import { React, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "../axios";

const VideoTitle = () => {
  return (
    <tr>
      <th>類型</th>
      <th>語言</th>
      <th>名稱</th>
    </tr>
  );
};

const VideoInfo = ({ ID, ClassID, Language, Title }) => {
  return (
    <tr key={ID}>
      <td>{ClassID}</td>
      <td>{Language}</td>
      <td>{Title}</td>
    </tr>
  );
};

export default function Home() {
  const [videoData, setVideoData] = useState([
    {
      ID: 0,
      ClassID: "",
      Language: "",
      Title: "",
    },
  ]);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://laravel.test:8079/api/v1/GET/videos",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        // if res.data is an array, set videoData to res.data
        // otherwise, convert res.data to an array and set videoData to it
        setVideoData(
          Array.isArray(res.data.data) ? res.data.data : [res.data.data]
        );
        // setVideoData(res.data);

        // setVideoData();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="container">
      <h1>影片資訊欄位</h1>

      {videoData === null ? (
        <p>Loading...</p>
      ) : (
        <div className="mt-3 mb-3">
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
