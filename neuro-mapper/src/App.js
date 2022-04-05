import './css/App.css';
import './css/Map.css';

// import { MapSVG } from "./js/MapSVG.js";
import { MapCanvas } from "./js/MapCanvas.js";
import { MapSVG } from './js/MapSVG';
import { Store } from "./js/Store.js";
import { MapPlotly } from './js/MapPlotly';

let store = new Store();

function App() {
  return (
    <div className="App">
      <div id="App-main">
        {/* <MapSVG store={store}/> */}
        <MapPlotly store={store} />
      </div>
    </div>
  );
}

export default App;
