import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";
import http from "../httpService";

const WebcamVideo = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
    setTimeout(() => {
      handleStopCaptureClick();
    }, 20000);
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const handleUpload = async () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      console.log(blob);
      let file = new File([blob], "recorded-video.webm");
      const data = new FormData();
      data.append("video", file, "recorded-video.webm");
      http
        .post("/upload", data, {
          headers: {
            "Content-Type": `multipart/form-data`,
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const videoConstraints = {
    width: { min: 480 },
    height: { min: 720 },
  };

  const dataSize = recordedChunks.length && recordedChunks[0].size;
  const dataSizeToMB = (dataSize * 0.000001).toFixed(1);

  return (
    <div className="App">
      <h1>React Recorder App</h1>
      <div className="Container">
        <Webcam
          audio={true}
          width={480}
          height={720}
          videoConstraints={videoConstraints}
          ref={webcamRef}
        />
        {capturing ? (
          <button onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Start Capture</button>
        )}
        {recordedChunks.length > 0 && (
          <div className="button-box">
            <button onClick={handleDownload}>
              Download - {dataSizeToMB} MB
            </button>
            <button onClick={handleUpload}>Upload</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamVideo;
