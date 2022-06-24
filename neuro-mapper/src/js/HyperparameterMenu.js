import { observer } from "mobx-react";
import { Button, Slider } from "@mui/material";
import * as constant from "./constant.js";
import { useState } from "react";
import Popover from "@mui/material/Popover";

export const HyperparameterMenu = observer(
    ({
      store,
      index
    }) => {
        const [anchorElNNeighbors, setAnchorElNNeighbors] = useState(null);

        const handleClickNNeighbors = (event) => {
            setAnchorElNNeighbors(event.currentTarget);
        };

        const handleCloseNNeighbors = () => {
            setAnchorElNNeighbors(null);
        };

        const [anchorElMinDist, setAnchorElMinDist] = useState(null);

        const handleClickMinDist = (event) => {
            setAnchorElMinDist(event.currentTarget);
        };

        const handleCloseMinDist = () => {
            setAnchorElMinDist(null);
        };

        const [anchorElSampleSize, setAnchorElSampleSize] = useState(null);

        const handleClickSampleSize = (event) => {
            setAnchorElSampleSize(event.currentTarget);
        };

        const handleCloseSampleSize = () => {
            setAnchorElSampleSize(null);
        };

        const [curNNeighbors, setCurNNeighbors] = useState(constant.defaultNNeighbors[index]);
        const [curMinDist, setCurMinDist] = useState(constant.defaultMinDist[index]);
        const [curSampleSize, setCurSampleSize] = useState(constant.defaultSampleSize);

        let handleNNeighborsSliderChange = (e, val) => {
            if (val !== curNNeighbors) {
                setCurNNeighbors(val)
                store.setNNeighbors(index, val)
                store.loadCustomEmbData(index, val, curMinDist, curSampleSize)

            }
        }

        let handleMinDistsSliderChange = (e, val) => {
            if (val !== curMinDist) {
                setCurMinDist(val)
                store.setMinDists(index, val)
                store.loadCustomEmbData(index, curNNeighbors, val, curSampleSize)
            }
        }

        let handleSampleSizeSliderChange = (e, val) => {
            setCurSampleSize(val)
        }

        return (
            <div className="hyperparameter-menu">
                <div className="hyperparameter-display">
                    <div id="nn-text" className="hp-item">
                        <div className="hp-label">N-Neighbors</div>
                        <Button onClick={handleClickNNeighbors}>
                            <div className="hp-value">{curNNeighbors}</div>
                        </Button>
                        <Popover
                            anchorEl={anchorElNNeighbors}
                            onClose={handleCloseNNeighbors}
                            open={Boolean(anchorElNNeighbors)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <div className="hp-slider">
                                <Slider
                                    defaultValue={constant.defaultNNeighbors[index]}
                                    value={curNNeighbors}
                                    step={null}
                                    marks={[{value: 5}, {value: 20}, {value: 100}]}
                                    onChange={handleNNeighborsSliderChange} 
                                />
                            </div>
                            
                        </Popover>
                    </div>
                    <div id="md-text" className="hp-item">
                        <div className="hp-label">Min Distance</div>
                        <Button onClick={handleClickMinDist}>
                            <div className="hp-value">{curMinDist}</div>
                        </Button>
                        <Popover
                            anchorEl={anchorElMinDist}
                            onClose={handleCloseMinDist}
                            open={Boolean(anchorElMinDist)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <div className="hp-slider">
                            <Slider
                                defaultValue={constant.defaultMinDist[index]}
                                value={curMinDist}
                                min={0}
                                max={1}
                                step={null}
                                marks={[{value: 0.1}, {value: 0.4}, {value: 0.7}, {value: 0.99}]}
                                onChange={handleMinDistsSliderChange}
                            />
                            </div>
                        </Popover>
                    </div>
                </div>
            </div>
        )
    }
)