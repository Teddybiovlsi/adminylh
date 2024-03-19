import React, { useEffect, useState } from "react";
import VideoJS from "../../components/VideoJS";
import { useLocation } from "react-router-dom";
import { get } from "../axios";
import "video.js/dist/video-js.css";
import Loading from "../../components/Loading";
import "../../components/videoqa.css";

export default function VideoPlayer() {
  const location = useLocation();
  const videoUUID = location.state?.videoUUID;
  const videoPath = location.state?.videoPath;
  const videoType = location.state?.videoType;

  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const videoJsOptions = {
    controls: true,
    autoplay: false,
    responsive: true,
    fluid: true,
    muted: true,
    sources: [
      {
        src: videoPath,
        type: "video/mp4",
      },
    ],
  };

  useEffect(() => {
    let ignore = false;
    if (!ignore && videoType !== 2) {
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
        api: `videoQA/${videoUUID}`,
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
