import { useState, useEffect } from "react";
import React from "react";
import { Modal } from "react-bootstrap";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./videoqa.css";

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const [currentTime, setCurrentTime] = React.useState(null);
  const playerRef = React.useRef(null);
  const { options, InteruptTime } = props;
  const [sendstate, setSendstate] = React.useState(false);
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
      // // if yes, exit fullscreen mode
      document.exitFullscreen();
      // remove the className from the video container
      document
        .getElementById("video-container-textfield")
        .classList.remove("fullscreen");
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
      // 依據不同的瀏覽器，進入全螢幕的方法不同
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen();
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
      }));
      // addChild("componentName", {componentProps}, componentIndex)
      // 其中componentIndex為可選參數，若不指定則預設為0，代表在controlBar的第一個位置
      var fullScreenBtn = player.controlBar.addChild("button", {}, 18);
      var fullScreenBtnDom = fullScreenBtn.el();
      fullScreenBtnDom.innerHTML = `<span class="vjs-icon-fullscreen-enter" id="fullscreenBtn"></span>`;
      fullScreenBtnDom.title = "fullscreen";
      fullScreenBtn.on("click", () => {
        toggleFullScreen();
      });

      player.on("waiting", () => {
        console.log("player is waiting");
      });
      player.on("play", () => {
        console.log("player is play");
      });
      player.on("pause", () => {
        setSendstate(true);
        // console.log("player is pause");
      });
      player.on("timeupdate", () => {
        console.log(player.currentTime());
        if (player.currentTime() >= 3) {
          player.pause();
        }
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
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div id="video-container" className="container">
      <div data-vjs-player>
        <div ref={videoRef} className="video-js vjs-default-skin" />
      </div>
      {sendstate && (
        <div id="video-container-textfield" className="text-overlay">
          <h1>Video.js</h1>
          <p>
            An open source HTML5 and Flash video player, <br />
            that makes it easy to <em>customize</em> your embed.
          </p>
        </div>
      )}

      {/* <div>
        <button
          onClick={() => {
            // check if the document is in fullscreen mode
            if (document.fullscreenElement) {
              // console.log("exit fullscreen");
              // // if yes, exit fullscreen mode
              document.exitFullscreen();
              // // remove the className from the video container
              // document
              //   .getElementById("video-container-textfield")
              //   .classList.remove("fullscreen");
            } else {
              document.getElementById("video-container").requestFullscreen();
              document
                .getElementById("video-container-textfield")
                .classList.add("fullscreen");
            }
          }}
        >
          全螢幕
        </button>
      </div> */}
    </div>
  );
};

export default VideoJS;
