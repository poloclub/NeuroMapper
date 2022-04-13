import './css/App.css';
import './css/Map.css';
import './css/NavBar.css'
import './css/LeftPane.css'
import './css/RightPane.css'

import { MapScatterGL } from "./js/MapScatterGL.js";
import { NavBar } from "./js/NavBar.js"
import { Store } from "./js/Store.js";
import { LeftPane } from "./js/LeftPane.js"
import { RightPane } from "./js/RightPane.js"

let store = new Store();

function App() {
  return (
    <div className="App">
      <div id="App-main">
        <NavBar store={store}/>
        <div id="App-body">
          <LeftPane store={store}/>
          <MapScatterGL store={store}/>
          <RightPane store={store}/>
        </div> 
      </div>
    </div>
  );
}

export default App;
