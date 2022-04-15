import { observer } from "mobx-react";
import { ScatterGL } from "scatter-gl";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";

import * as constant from "./constant.js";

export const EpochControlBottons = observer(({ store }) => {

  const handleEpochChange = (epoch) => {
    store.setEpoch(epoch);

    for (let i = 0; i < constant.layers.length; i++) {
      let layer = constant.layers[i];
      let points = store.embData[layer];
      let epoch = store.epoch;
      const labels = points.map((point) => point["label"]);
      const datapoints = points.map((point) => point["emb"][epoch]);
      const metadata = [];
      labels.forEach((element) => {
        metadata.push({
          labelIndex: element,
          label: constant.cifar_10_classes[element],
        });
      });
      const dataset = new ScatterGL.Dataset(datapoints, metadata);
      dataset.setSpriteMetadata({
        spriteImage: "spritesheet.png",
        singleSpriteSize: [32, 32],
      });
      store.plots[i].updateDataset(dataset);
    }
  };

  const clickPrevious = (e) => {
    let epochIdx = constant.epochs.indexOf(store.epoch)
    if (epochIdx == 0) {
      return;
    }

    let prevEpoch = constant.epochs[epochIdx - 1]
    handleEpochChange(prevEpoch)
  }

  const clickPlay = (e) => {
    store.setAnimationStatus("play")
  }

  const clickPause = (e) => {
    store.setAnimationStatus("pause")
  }

  const clickNext = (e) => {
    console.log("click next")
    let epochIdx = constant.epochs.indexOf(store.epoch)
    if (epochIdx == constant.epochs.length - 1) {
      return;
    }

    let nextEpoch = constant.epochs[epochIdx + 1]
    handleEpochChange(nextEpoch)
  }

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
