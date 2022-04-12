import './css/App.css';
import './css/Map.css';
import './css/NavBar.css'

import { MapSVG } from "./js/MapScatterGL.js";
import { NavBar } from "./js/NavBar.js"
import { Store } from "./js/Store.js";

let store = new Store();

function App() {
  return (
    <div className="App">
      <div id="App-main">
        <NavBar store={store}/>
        <MapSVG store={store}/>
      </div>
    </div>
  );
}

export default App;
