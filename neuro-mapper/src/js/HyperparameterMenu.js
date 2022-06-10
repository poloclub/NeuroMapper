import { observer } from "mobx-react";
import { Button, Slider } from "@mui/material";
import * as constant from "./constant.js";
import { useState } from "react";
import Popover from "@mui/material/Popover";
import { IconButton } from "@mui/material";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import FlipIcon from '@mui/icons-material/Flip';

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
                <div className="hyperparameter-display">
                    <div id="nn-text" className="hp-item">
                        <div class="hp-label">N-Neighbors</div>
                        <Button onClick={handleClickNNeighbors}>
                            <div class="hp-value">{curNNeighbors}</div>
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
                            <div class="hp-slider">
                                <Slider
                                    defaultValue={constant.defaultNNeighbors[index]}
                                    step={null}
                                    marks={[{value: 5}, {value: 20}, {value: 100}]}
                                    onChange={handleNNeighborsSliderChange} 
                                />
                            </div>
                            
                        </Popover>
                    </div>
                    <div id="md-text" className="hp-item">
                        <div class="hp-label">Min Distance</div>
                        <Button onClick={handleClickMinDist}>
                            <div class="hp-value">{curMinDist}</div>
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
                            <div class="hp-slider">
                            <Slider
                                defaultValue={constant.defaultMinDist[index]}
                                min={0}
                                max={1}
                                step={null}
                                marks={[{value: 0.1}, {value: 0.5}]}
                                onChange={handleMinDistsSliderChange}
                            />
                            </div>
                            
                        </Popover>
                    </div>
                    <div id="md-text" className="hp-item">
                        <div class="hp-label">Sample Size</div>
                        <Button onClick={handleClickSampleSize}>
                            <div class="hp-value">{curSampleSize}</div>
                        </Button>
                        <Popover
                            anchorEl={anchorElSampleSize}
                            onClose={handleCloseSampleSize}
                            open={Boolean(anchorElSampleSize)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <div class="hp-slider">
                            <Slider
                            defaultValue={constant.defaultSampleSize[index]}
                            min={0}
                            max={10000}
                            step={2000}
                            onChange={handleSampleSizeSliderChange}
                        />
                            </div>
                            
                        </Popover>
                    </div>
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
                <div className='scatter-gl-rotate'> 
                    <IconButton onClick={() => {
                        let amount = constant.flipAmount[index] === 1 ? 1 : -1
                        constant.rotationAmount[index] = (constant.rotationAmount[index] + amount) % 12
                        store.updateCustomEmbData(index);
                    }}>
                        <RotateLeftIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                        let amount = constant.flipAmount[index] === 1 ? -1 : 1
                        constant.rotationAmount[index] = (constant.rotationAmount[index] + amount) % 12
                        store.updateCustomEmbData(index);
                    }}>
                        <RotateRightIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                        constant.flipAmount[index] = constant.flipAmount[index] * -1
                        store.updateCustomEmbData(index);
                    }}>
                        <FlipIcon />
                    </IconButton>
                </div>
            </div>
        )
    }
)