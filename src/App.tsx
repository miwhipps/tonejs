import "./App.css";
import Synth1 from "./components/Synth1";
import Sampler from "./components/Sampler";
import Keyboard from "./components/Keyboard";

function App() {
  return (
    <>
      <h1>TONEJS</h1>
      <div>
        <Synth1 />
      </div>
      <div>
        <Sampler />
      </div>
      <div>
        <Keyboard />
      </div>
    </>
  );
}

export default App;
