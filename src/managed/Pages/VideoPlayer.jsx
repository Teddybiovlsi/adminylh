import React, { useEffect, useState } from "react";
import VideoJS from "../../components/VideoJS";
import { useLocation } from "react-router-dom";
import StatusCode from "../../sys/StatusCode";
import { get } from "../axios";
import "video.js/dist/video-js.css";
import Loading from "../../components/Loading";

export default function VideoPlayer() {
  const location = useLocation();
  const VideoUUID = location.state?.videoUUID;
  const VideoPath = location.state?.videoPath;

  const [info, setInfo] = useState({});
  const [videoQA, setVideoQA] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  const [videoQuestion, setVideoQuestion] = useState([]);
  const [videoAnswer, setVideoAnswer] = useState([]);
  const [sendstate, setSendstate] = useState(false);
  // const [showQAModal, setShowQAModal] = useState(false);
  // const handelCloseQAModal = () => setShowQAModal(false);
  const [interruptTime, setInterruptTime] = useState(null);

  let arrayNum = 0;
  const videoJsOptions = {
    controls: true,
    autoplay: false,
    playbackRates: [0.5, 1, 1.25, 1.5, 2],
    responsive: true,
    fluid: true,
    muted: true,
    sources: [
      {
        src: VideoPath,
        type: "video/mp4",
      },
    ],
  };

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      async function fetchVideoData({ api }) {
        try {
          setLoading(true);
          const response = await get(api);
          const VideoInfo = await response.data.data;
          setInfo(VideoInfo);
          setLoading(false);
        } catch (error) {}
      }

      fetchVideoData({
        api: `videoQA/${VideoUUID}`,
      });
    }

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <VideoJS options={videoJsOptions} info={info} />
    </>
  );
}
