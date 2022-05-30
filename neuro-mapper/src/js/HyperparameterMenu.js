import { observer } from "mobx-react";
import { Button, Slider } from "@mui/material";
import * as constant from "./constant.js";
import { useState } from "react";

export const HyperparameterMenu = observer(
    ({
      store,
      index
    }) => {
        const [curNNeighbors, setCurNNeighbors] = useState(constant.defaultNNeighbors[index]);
        const [curMinDist, setCurMinDist] = useState(constant.defaultMinDist[index]);
        const [curSampleSize, setCurSampleSize] = useState(constant.defaultSampleSize[index]);

        let handleNNeighborsSliderChange = (e, val) => {
            setCurNNeighbors(val)
        }

        let handleMinDistsSliderChange = (e, val) => {
            setCurMinDist(val)
        }

        let handleSampleSizeSliderChange = (e, val) => {
            setCurSampleSize(val)
        }

        return (
            <div className="hyperparameter-menu">
                <div id="nn-text" className="hp-text">N-Neighbors</div>
                <div id="nn-slider" className="hp-slider">
                    <Slider
                        defaultValue={constant.defaultNNeighbors[index]}
                        valueLabelDisplay="auto"
                        step={null}
                        marks={[{value: 5}, {value: 20}, {value: 100}]}
                        onChange={handleNNeighborsSliderChange} />
                </div>
                <div id="md-text" className="hp-text">Min Distance</div>
                <div id="md-slider" className="hp-slider">
                    <Slider
                        defaultValue={constant.defaultMinDist[index]}
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
                        defaultValue={constant.defaultSampleSize[index]}
                        min={0}
                        max={10000}
                        valueLabelDisplay="auto"
                        step={2000}
                        onChange={handleSampleSizeSliderChange}
                    />
                </div>
                <div className="hp-button">
                    <Button
                        onClick={() => {
                            store.loadCustomEmbData(index, store.nNeighbors[index], store.minDists[index])
                            store.setNNeighbors(index, curNNeighbors)
                            store.setMinDists(index, curMinDist)
                            store.setSampleSize(index, curSampleSize)
                        }}
                        disabled={curNNeighbors === store.nNeighbors[index] 
                            && curMinDist === store.minDists[index] 
                            && curSampleSize === store.sampleSize[index]}
                        variant={"contained"}
                    >
                        Apply Parameters
                    </Button>
                </div>
            </div>
        )
    }
)