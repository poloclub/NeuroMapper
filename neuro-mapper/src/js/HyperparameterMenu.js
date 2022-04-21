import { observer } from "mobx-react";
import { Slider } from "@mui/material";
import * as constant from "./constant.js";

const NNeighborsValues = [5, 20, 100];
const MinDistsValues = [0.1, 0.5]

export const HyperparameterMenu = observer(
    ({
      store,
      index
    }) => {

        let handleNNeighborsSliderChange = (e, val) => {
            store.setNNeighbors(index, NNeighborsValues[val])
        }

        let handleMinDistsSliderChange = (e, val) => {
            store.setMinDists(index, MinDistsValues[val])
        }

        let handleSampleSizeSliderChange = (e, val) => {
            store.setSampleSize(index, val)
        }

        let NNeighborsLabelFormat = (value) => {
            return NNeighborsValues[value];
        }

        let MinDistsLabelFormat = (value) => {
            return MinDistsValues[value];
        }

        return (
            <div className="hyperparameter-menu">
                <div id="nn-text" className="hp-text">N-Neighbors</div>
                <div id="nn-slider" className="hp-slider">
                    <Slider
                        defaultValue={NNeighborsValues.indexOf(constant.defaultNNeighbors[index])}
                        valueLabelFormat={NNeighborsLabelFormat}
                        valueLabelDisplay="auto"
                        min={0}
                        step={1}
                        max={NNeighborsValues.length - 1}
                        marks
                        onChange={handleNNeighborsSliderChange} />
                </div>
                <div id="md-text" className="hp-text">Min Distance</div>
                <div id="md-slider" className="hp-slider">
                    <Slider
                        defaultValue={MinDistsValues.indexOf(constant.defaultMinDist[index])}
                        valueLabelFormat={MinDistsLabelFormat}
                        valueLabelDisplay="auto"
                        min={0}
                        step={1}
                        max={MinDistsValues.length - 1}
                        marks
                        onChange={handleMinDistsSliderChange}
                    />
                </div>
                <div id="md-text" className="hp-text">Sample Size</div>
                <div id="md-slider" className="hp-slider">
                    <Slider
                        defaultValue={constant.defaultSampleSize[index]}
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