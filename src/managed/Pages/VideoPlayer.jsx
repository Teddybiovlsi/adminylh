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

  // const playerRef = React.useRef(null);

  const handlePlayerReady = (player) => {
    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });

    player.on("pause", () => {
      console.log("player is pause");
      // setSendstate(true);
    });

    player.on("timeupdate", () => {
      // console.log(info[arrayNum].video_interrupt_time);
      // console.log(info[arrayNum].video_duration);
      // console.log(arrayNum);
      // if (arrayNum < totalArrayLength) {
      //   if (player.currentTime() >= info[arrayNum].video_interrupt_time) {
      //     player.pause();
      //     // setInterruptTime(player.currentTime());
      //     // setInterruptTime(player.currentTime());
      //     // set the timer with the duration time after duration time, the video will resume
      //     // setTimeout(() => {
      //     //   player.play();
      //     // }, info[arrayNum].video_duration * 1000);
      //     arrayNum++;
      //   }
      // }
    });
    player.on("resume", () => {
      console.log("player is resume");
      // show the certain time
      // console.log(player.currentTime());
    });
  };

  if (loading) return <Loading />;

  return (
    <>
      <VideoJS options={videoJsOptions} info={info} />
    </>
  );
}
