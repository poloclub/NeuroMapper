import "./css/App.css";
import "./css/Map.css";
import "./css/NavBar.css";
import "./css/EpochControlButtons.css";
import './css/App.css';
import './css/Map.css';
import './css/NavBar.css'
import './css/HyperparameterMenu.css'

import { MapScatterGL } from "./js/MapScatterGL.js";
import { NavBar } from "./js/NavBar.js";
import { Store } from "./js/Store.js";

let store = new Store();

function App() {
  return (
    <div className="App">
      <div id="App-main">
        <NavBar store={store} />
        <div id="App-body">
          <MapScatterGL store={store}/>
        </div> 
      </div>
    </div>
  );
}

export default App;
