import Webcam from "react-webcam";

export default function WebcamVideo() {
  const videoConstraints = {
    width: { min: 480 },
    height: { min: 720 },
  };

  return (
    <div className="Container">
      <Webcam
        audio={true}
        width={480}
        height={720}
        videoConstraints={videoConstraints}
      />
    </div>
  );
}
