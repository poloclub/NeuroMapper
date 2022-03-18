import './css/App.css';
import './css/Map.css';

import { Map } from "./js/Map.js";
import { Store } from "./js/Store.js";

let store = new Store();

function App() {
  return (
    <div className="App">
      <div id="App-main">
        <Map store={store}/>
      </div>
    </div>
  );
}

export default App;
