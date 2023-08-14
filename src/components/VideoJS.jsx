import { useState, useEffect, useRef } from "react";
import React from "react";
import { Col, Form } from "react-bootstrap";
import BtnBootstrap from "./BtnBootstrap";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./videoqa.css";

export const VideoJS = (props) => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(null);
  const playerRef = useRef(null);
  const { options, info } = props;
  const [sendstate, setSendstate] = useState(false);
  const [optionChecked, setOptionChecked] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tempQuestionNum, setTempQuestionNum] = useState(1);

  const [answerState, setAnswerState] = useState([]);
  const [hasAnswer, setHasAnswer] = useState(false);

  const [screen, setScreen] = useState({
    width: "",
    height: "",
  });
  // calculate the total length of the array
  let arrayNum = 0;

  const handleCheckedAnswer = (e) => {
    setOptionChecked(e.target.value);
  };

  const toggleFullScreen = () => {
    const videoElement = document.getElementById("video-container");
    if (document.fullscreenElement) {
      // if fullscreen mode is active, exit by calling fullscreen API
      // 第一步驟，將icon轉換成進入全螢幕的icon，透過classList的replace方法
      // replace("要被替換的className", "替換後的className")
      document
        .getElementById("fullscreenBtn")
        .classList.replace(
          "vjs-icon-fullscreen-exit",
          "vjs-icon-fullscreen-enter"
        );

      document
        .getElementById("video-container_Container_player")
        .classList.remove("fullscreen");
      // // if yes, exit fullscreen mode
      document.exitFullscreen();

      setIsFullscreen(false);
    } else {
      // 若fullscreen mode不是active，則進入fullscreen mode
      // 第一步驟，將icon轉換成離開全螢幕的icon，透過classList的replace方法
      // replace("要被替換的className", "替換後的className")
      document
        .getElementById("fullscreenBtn")
        .classList.replace(
          "vjs-icon-fullscreen-enter",
          "vjs-icon-fullscreen-exit"
        );
      // add fullscreen className to the videoPlayer className
      document
        .getElementById("video-container_Container_player")
        .classList.add("fullscreen");

      setIsFullscreen(true);
      // 依據不同的瀏覽器，進入全螢幕的方法不同
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen();
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen();
      } else {
        console.log("fullscreen error");
      }
    }
  };

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      // if screen size is smaller than 768px, then add fullscreen button
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
      }));

      // addChild("componentName", {componentProps}, componentIndex)
      // 其中componentIndex為可選參數，若不指定則預設為0，代表在controlBar的第一個位置
      var fullScreenBtn = player.controlBar.addChild(
        "button",
        {
          clickHandler: function (event) {
            toggleFullScreen();
          },
        },
        19
      );
      var fullScreenBtnDom = fullScreenBtn.el();
      fullScreenBtnDom.innerHTML = `<span class="vjs-icon-fullscreen-enter" id="fullscreenBtn"></span>`;
      fullScreenBtnDom.title = "fullscreen";

      player.on("waiting", () => {
        console.log("player is waiting");
      });
      player.on("play", () => {
        console.log("sendState", sendstate);
        // console.log("player is play");
      });
      player.on("pause", () => {
        // console.log("ArrayNum", arrayNum);
        // console.log("tempQuestionNum", tempQuestionNum);
        setTempQuestionNum(arrayNum);
      });

      // Add event listener for loadedmetadata
      player.on("loadedmetadata", () => {
        const video = player;
        if (video.videoHeight() > video.videoWidth()) {
          player.aspectRatio("16:9");
        } else {
          player.fluid(true);
        }
      });

      player.on("timeupdate", () => {
        if (arrayNum < info.length) {
          if (player.currentTime() >= info[arrayNum].video_interrupt_time) {
            player.pause();
            setSendstate(true);
            setTimeout(() => {
              setSendstate(false);
              player.play();
            }, info[arrayNum].video_duration * 1000);
            arrayNum++;
          }
        }
      });

      player.on("ended", () => {
        console.log("player is ended");
      });

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  document.addEventListener("fullscreenchange", exitHandler);
  document.addEventListener("webkitfullscreenchange", exitHandler);
  document.addEventListener("mozfullscreenchange", exitHandler);
  document.addEventListener("MSFullscreenChange", exitHandler);
  // 離開全螢幕時，將icon轉換成進入全螢幕的icon，透過classList的replace方法
  function exitHandler() {
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      document
        .getElementById("fullscreenBtn")
        .classList.replace(
          "vjs-icon-fullscreen-exit",
          "vjs-icon-fullscreen-enter"
        );
      document
        .getElementById("video-container_Container_player")
        .classList.remove("fullscreen");
    }
  }

  function handleSubmitAnswer() {
    let answer = "";
    if (
      info[tempQuestionNum - 1].option_3 !== undefined &&
      info[tempQuestionNum - 1].option_4 !== undefined
    ) {
      // find the answer which option[1] is 1
      if (info[tempQuestionNum - 1].option_1[1] === 1) {
        answer = info[tempQuestionNum - 1].option_1[0];
      } else if (info[tempQuestionNum - 1].option_2[1] === 1) {
        answer = info[tempQuestionNum - 1].option_2[0];
      } else if (info[tempQuestionNum - 1].option_3[1] === 1) {
        answer = info[tempQuestionNum - 1].option_3[0];
      } else if (info[tempQuestionNum - 1].option_4[1] === 1) {
        answer = info[tempQuestionNum - 1].option_4[0];
      }
    } else if (
      info[tempQuestionNum - 1].option_3 !== undefined &&
      info[tempQuestionNum - 1].option_4 === undefined
    ) {
      // find the answer which option[1] is 1
      if (info[tempQuestionNum - 1].option_1[1] === 1) {
        answer = info[tempQuestionNum - 1].option_1[0];
      } else if (info[tempQuestionNum - 1].option_2[1] === 1) {
        answer = info[tempQuestionNum - 1].option_2[0];
      } else if (info[tempQuestionNum - 1].option_3[1] === 1) {
        answer = info[tempQuestionNum - 1].option_3[0];
      }
    } else {
      // find the answer which option[1] is 1
      if (info[tempQuestionNum - 1].option_1[1] === 1) {
        answer = info[tempQuestionNum - 1].option_1[0];
      } else if (info[tempQuestionNum - 1].option_2[1] === 1) {
        answer = info[tempQuestionNum - 1].option_2[0];
      }
    }
    if (optionChecked === answer) {
      setAnswerState([
        ...answerState,
        {
          tempQuestionNum: info[tempQuestionNum - 1].quiz_id,
          correctAnswer: true,
          wrongAnswer: "",
          timeOutNoAnswer: false,
        },
      ]);
      setSendstate(false);
      playerRef.current.play();
    } else {
      setAnswerState([
        ...answerState,
        {
          tempQuestionNum: info[tempQuestionNum - 1].quiz_id,
          correctAnswer: false,
          wrongAnswer: optionChecked,
          timeOutNoAnswer: false,
        },
      ]);
      setSendstate(false);
      playerRef.current.play();
    }
  }

  return (
    <div id="video-container">
      <div className="video-container_Container">
        <div
          data-vjs-player
          id="video-container_Container_player"
          className="videoPlayer"
        >
          <div ref={videoRef} className="video-js vjs-default-skin" />
        </div>
        {sendstate && (
          <div id="video-container-textfield" className="text-overlay">
            <Form>
              <h1 className="text-overlay_title">第{tempQuestionNum}題</h1>
              <Col className="fs-5">
                {info[tempQuestionNum - 1].video_question}
              </Col>
              <Col className="fs-5 mt-3">
                <Form.Check
                  type="radio"
                  label={info[tempQuestionNum - 1].option_1[0]}
                  value={info[tempQuestionNum - 1].option_1[0]}
                  name="option_1"
                  id="formHorizontalRadios1"
                  checked={
                    optionChecked === info[tempQuestionNum - 1].option_1[0]
                      ? true
                      : false
                  }
                  onChange={handleCheckedAnswer}
                />
                <Form.Check
                  type="radio"
                  label={info[tempQuestionNum - 1].option_2[0]}
                  value={info[tempQuestionNum - 1].option_2[0]}
                  name="option_2"
                  id="formHorizontalRadios2"
                  checked={
                    optionChecked === info[tempQuestionNum - 1].option_2[0]
                      ? true
                      : false
                  }
                  onChange={handleCheckedAnswer}
                />
                {info[tempQuestionNum - 1].option_3 !== undefined && (
                  <Form.Check
                    type="radio"
                    label={info[tempQuestionNum - 1].option_3[0]}
                    value={info[tempQuestionNum - 1].option_3[0]}
                    name="option_3"
                    id="formHorizontalRadios3"
                    checked={
                      optionChecked === info[tempQuestionNum - 1].option_3[0]
                        ? true
                        : false
                    }
                    onChange={handleCheckedAnswer}
                  />
                )}
                {info[tempQuestionNum - 1].option_4 !== undefined && (
                  <Form.Check
                    type="radio"
                    label={info[tempQuestionNum - 1].option_4[0]}
                    value={info[tempQuestionNum - 1].option_4[0]}
                    name="option_4"
                    id="formHorizontalRadios4"
                    checked={
                      optionChecked === info[tempQuestionNum - 1].option_4[0]
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      console.log(e.target.value);
                      setOptionChecked(e.target.value);
                    }}
                  />
                )}
              </Col>
              <Col className="sendBtn">
                <BtnBootstrap
                  id="resetBtn"
                  btnName="ResetBtn"
                  btnPosition="btn-start"
                  text={"重置"}
                  variant={"btn reset me-3"}
                  onClickEventName={() => {
                    setOptionChecked("");
                  }}
                />
                <BtnBootstrap
                  id="sendBtn"
                  btnName="ConfirmBtn"
                  text={"送出"}
                  variant={"btn send"}
                  onClickEventName={() => {
                    handleSubmitAnswer();
                  }}
                />
              </Col>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoJS;
