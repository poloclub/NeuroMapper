import * as constant from "./constant.js";
import { observer } from "mobx-react";
import { Slider } from "@mui/material";
import { ScatterGL, RenderMode } from "scatter-gl";
import { EpochControlBottons } from "./EpochControlButtons.js";

export const EpochControl = observer(({ store }) => {
  const handleSliderChange = (e, val) => {
    let epoch = val;
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

  return (
    <div id="epoch-control">
      <Slider
        value={store.epoch}
        valueLabelDisplay="auto"
        step={5}
        min={constant.epochs[0]}
        max={constant.epochs.slice(-1)[0]}
        color="secondary"
        onChange={handleSliderChange}
      />
      <div id="epoch-val">epoch = {store.epoch}</div>
      <EpochControlBottons store={store} />
    </div>
  );
});
