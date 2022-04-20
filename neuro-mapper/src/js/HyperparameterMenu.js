import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { Slider } from "@mui/material";

export const HyperparameterMenu = observer(
    ({
      store,
      index
    }) => {

        let handleNNeighborsSliderChange = (e, val) => {
            store.setNNeighbors(index, val)
        }

        let handleMinDistsSliderChange = (e, val) => {
            store.setMinDists(index, val)
        }

        let handleSampleSizeSliderChange = (e, val) => {
            store.setSampleSize(index, val)
        }

        return (
            <div className="hyperparameter-menu">
                <div id="nn-text" className="hp-text">N-Neighbors</div>
                <div id="nn-slider" className="hp-slider">
                    <Slider
                        defaultValue={store.nNeighbors[index]}
                        valueLabelDisplay="auto"
                        step={null}
                        marks={[{value: 5}, {value: 20}, {value: 100}]}
                        onChange={handleNNeighborsSliderChange} />
                </div>
                <div id="md-text" className="hp-text">Min Distance</div>
                <div id="md-slider" className="hp-slider">
                    <Slider
                        defaultValue={store.minDists[index]}
                        min={0}
                        max={1}
                        valueLabelDisplay="auto"
                        step={null}
                        marks={[{value: 0.1}, {value: 0.5}]}
                        onChange={handleMinDistsSliderChange}
                    />
                </div>
                <div id="md-text" className="hp-text">Sample Size</div>
                <div id="md-slider" className="hp-slider">
                    <Slider
                        defaultValue={store.sampleSize[index]}
                        min={0}
                        max={10000}
                        valueLabelDisplay="auto"
                        step={2000}
                        onChange={handleSampleSizeSliderChange}
                    />
                </div>
            </div>
        )
    }
)