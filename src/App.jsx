import Webcam from "react-webcam";
import "./App.css";

const videoConstraints = {
  width: { min: 480 },
  height: { min: 720 },
};

function App() {
  return (
    <div className="App">
      <Webcam
        audio={true}
        width={480}
        height={720}
        videoConstraints={videoConstraints}
      />
    </div>
  );
}

export default App;
