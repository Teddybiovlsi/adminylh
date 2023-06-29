import React, { useEffect, useState } from 'react';
import VideoJS from '../../components/VideoJS';
import { useLocation } from 'react-router-dom';
import StatusCode from '../../sys/StatusCode';
import { get } from '../axios';
import 'video.js/dist/video-js.css';
import Loading from '../../components/Loading';
import { Col, Container, Row } from 'react-bootstrap';
import '../../components/videoqa.css';

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
        type: 'video/mp4',
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

  // Get the video
  var video = document.getElementById('myVideo');

  // Get the button
  var btn = document.getElementById('myBtn');

  // Pause and play the video, and change the button text
  function myFunction() {
    if (video.paused) {
      video.play();
      btn.innerHTML = 'Pause';
    } else {
      video.pause();
      btn.innerHTML = 'Play';
    }
  }

  function fullscreen() {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      /* Firefox */
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      /* IE/Edge */
      video.msRequestFullscreen();
    }
  }

  if (loading) return <Loading />;

  return (
    <>
      <VideoJS options={videoJsOptions} info={info} />
    </>
  );
  // return (
  //   <>
  //     <div className='video_container'>
  //       <video id='myVideo'>
  //         <source src={VideoPath} type='video/mp4' />
  //       </video>

  //       <div className='content'>
  //         <h1>Heading</h1>
  //         <p>Lorem ipsum...</p>
  //         <button id='myBtn' onClick={myFunction}>
  //           Pause
  //         </button>
  //         <button id='myBtn' onClick={fullscreen}>fullscreen</button>
  //       </div>
  //     </div>
  //   </>
  // );
}
{
  /* <>
      <Container className='container_video'>
        <video className='videobackground' controls>
          <source src={VideoPath} type='video/mp4' />
        </video>
        <div className='overlay_form'>
          <h1>Video Info</h1>
          <p>Video Name: {info.video_name}</p>
          <p>Video Description: {info.video_description}</p>
          <p>Video UUID: {info.video_uuid}</p>
        </div>
      </Container>
    </> */
}
