import { observer } from "mobx-react";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";

import * as constant from "./constant.js";

export const EpochControlBottons = observer(({ store }) => {
  let numEpochs = constant.epochs.length;

  const handleEpochChange = (epoch) => {
    store.setEpoch(epoch);

    for (let i = 0; i < constant.layers.length; i++) {
      store.updateCustomEmbData(i);
    }

    // wait(500)
  };

  const getCurrentEpochIdx = () => {
    return constant.epochs.indexOf(store.epoch);
  };

  const clickPrevious = (e) => {
    let epochIdx = getCurrentEpochIdx();
    if (epochIdx == 0) {
      return;
    }
    let prevEpoch = constant.epochs[epochIdx - 1];
    handleEpochChange(prevEpoch);
  };

  const clickPlay = (e) => {
    store.setAnimationStatus("play");
    let epochIdx = getCurrentEpochIdx();

    for (let i = epochIdx; i < numEpochs; i++) {
      if (store.animationStatus == "pause") {
        break;
      }
      setTimeout(
        function () {
          if (store.animationStatus == "play") {
            clickNext();
          }
        }.bind(this),
        50
      );
    }

    epochIdx = getCurrentEpochIdx();
    if (epochIdx == numEpochs - 1) {
      store.setAnimationStatus("pause");
    }
  };

  const clickPause = (e) => {
    store.setAnimationStatus("pause");
  };

  const clickNext = (e) => {
    let epochIdx = getCurrentEpochIdx();
    if (epochIdx == numEpochs - 1) {
      return;
    }
    let nextEpoch = constant.epochs[epochIdx + 1];
    handleEpochChange(nextEpoch);
  };

  const wait = (ms) => {
    var d = new Date();
    var d2 = null;
    do {
      d2 = new Date();
    } while (d2 - d < ms);
  };

  return (
    <div id="epoch-control-buttons">
      <SkipPreviousRoundedIcon
        sx={{ fontSize: constant.buttonSize }}
        onClick={clickPrevious}
      />
      <PlayCircleRoundedIcon
        style={{
          display: store.animationStatus == "pause" ? "inline-block" : "none",
        }}
        sx={{ fontSize: constant.buttonSize }}
        onClick={clickPlay}
      />
      <PauseCircleRoundedIcon
        style={{
          display: store.animationStatus == "pause" ? "none" : "inline-block",
        }}
        sx={{ fontSize: constant.buttonSize }}
        onClick={clickPause}
      />
      <SkipNextRoundedIcon
        sx={{ fontSize: constant.buttonSize }}
        onClick={clickNext}
      />
    </div>
  );
});
