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

  const videoJsOptions = {
    controls: true,
    autoplay: false,
    playbackRates: [0.5, 1, 1.25, 1.5, 2],
    responsive: true,
    fluid: true,
    sources: [
      {
        src: VideoPath,
        type: "video/mp4",
      },
    ],
  };

  const fetchVideoData = async ({ api }) => {
    try {
      setLoading(true);
      const response = await get(api);
      response.data.videoQA.map((item) => {
        // console.log(item);
        setVideoQA((prev) => [
          ...prev,
          {
            video_question: item.video_question,
            video_duration: item.video_duration,
            video_interrupt_time: item.video_interrupt_time,
            option_1: JSON.parse(item.option_1),
            option_2: JSON.parse(item.option_2),
            option_3: JSON.parse(item.option_3),
            option_4: JSON.parse(item.option_4),
          },
        ]);
      });
      setLoading(false);
    } catch (error) {
      setError(StatusCode(error.response.status));
    }
  };

  useEffect(() => {
    fetchVideoData({
      api: `videoQA/${VideoUUID}`,
    });
  }, []);

  const playerRef = React.useRef(null);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videoJS.log("player is waiting");
    });

    player.on("dispose", () => {
      videoJS.log("player will dispose");
    });
  };

  if (loading) return <Loading />;
  return (
    <>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </>
  );
}
