import React, { useEffect, useState } from 'react';
import VideoJS from '../../components/VideoJS';
import { useLocation } from 'react-router-dom';
import StatusCode from '../../sys/StatusCode';
import { get } from '../axios';

export default function VideoPlayer() {
  const [info, setInfo] = useState({});

  const [error, setError] = useState(null);

  const location = useLocation();
  const VideoUUID = location.state?.UUID;

  const fetchVideoData = async ({ api }) => {
    try {
      const response = await get(api);
      const data = await response.json();
      setInfo(data);
    } catch (error) {
      setError(StatusCode(error.response.status));
    }
  };

  useEffect(() => {
    fetchVideoData({
      api: `/videoInfo/${VideoUUID}`,
    });
  }, []);

  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: '/path/to/video.mp4',
        type: 'video/mp4',
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      VideoJS.log('player is waiting');
    });

    player.on('dispose', () => {
      VideoJS.log('player will dispose');
    });
  };
  return (
    <>
      <div>Rest of app here</div>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      <div>Rest of app here</div>
    </>
  );
}
